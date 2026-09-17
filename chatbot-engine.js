// ============================================================
// INTENT CLASSIFICATION
// ============================================================

function classifyIntent(message) {
  const lower = message.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const [intent, data] of Object.entries(INTENTS)) {
    const score = data.keywords.filter(kw =>
      lower.includes(kw.toLowerCase())
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  return bestScore >= 1
    ? {
        intent: bestMatch,
        confidence: "high"
      }
    : {
        intent: "unknown",
        confidence: "low"
      };
}


// ============================================================
// RULE-BASED RESPONSE
// ============================================================

function getRuleResponse(intent) {
  return RULES[intent] ?? null;
}


// ============================================================
// CALL N8N → CLAUDE
// ============================================================

async function getAIResponse(history) {

  try {

    const response = await fetch("YOUR_N8N_WEBHOOK_URL", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        history: history
      })
    });


    // Check if n8n returned an error
    if (!response.ok) {
      throw new Error(
        `n8n request failed: ${response.status}`
      );
    }


    const data = await response.json();


    // Expected n8n response:
    // {
    //   "reply": "Claude's response"
    // }

    if (!data.reply) {
      throw new Error("No reply received from n8n");
    }


    return data.reply;

  } catch (error) {

    console.error("AI request error:", error);

    return "Sorry, I'm having trouble processing your request right now. Please try again.";
  }
}


// ============================================================
// CONVERSATION HISTORY
// ============================================================

// Conversation history exists only while
// the webpage remains open.

const conversationHistory = [];


// ============================================================
// MAIN MESSAGE HANDLER
// ============================================================

async function handleMessage(userMessage) {

  // Ignore empty messages
  if (!userMessage || !userMessage.trim()) {
    return "Please enter a message.";
  }


  // Add user's message to conversation history
  conversationHistory.push({
    role: "user",
    content: userMessage
  });


  let reply;


  // ==========================================================
  // CLASSIFY USER MESSAGE
  // ==========================================================

  const {
    intent,
    confidence
  } = classifyIntent(userMessage);


  // ==========================================================
  // USE RULE-BASED RESPONSE
  // ==========================================================

  if (confidence === "high") {

    reply = getRuleResponse(intent);


    // If an intent was detected but no rule exists,
    // send it to AI instead.
    if (!reply) {

      reply = await getAIResponse(
        conversationHistory.slice(-10)
      );

    }

  }


  // ==========================================================
  // USE AI FOR UNKNOWN QUESTIONS
  // ==========================================================

  else {

    reply = await getAIResponse(
      conversationHistory.slice(-10)
    );

  }


  // ==========================================================
  // SAVE ASSISTANT RESPONSE
  // ==========================================================

  conversationHistory.push({
    role: "assistant",
    content: reply
  });


  return reply;
}
