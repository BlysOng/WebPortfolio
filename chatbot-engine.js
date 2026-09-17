// ============================================================
// INTENTS
// ============================================================
// Keep your existing INTENTS object here.
// Example:
//
// const INTENTS = {
//   greeting: {
//     keywords: ["hello", "hi", "hey"],
//   },
//   services: {
//     keywords: ["services", "what do you do", "service"],
//   },
//   contact: {
//     keywords: ["contact", "email", "phone"],
//   }
// };


// ============================================================
// RULES
// ============================================================
// Keep your existing RULES object here.
// Example:
//
// const RULES = {
//   greeting: "Hello! How can I help you?",
//   services: "We provide automation and AI solutions.",
//   contact: "You can contact us through our contact page."
// };


// ============================================================
// CLASSIFY INTENT FROM USER MESSAGE
// ============================================================

function classifyIntent(message) {

  const lower = message.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;


  for (const [intent, data] of Object.entries(INTENTS)) {

    const score = data.keywords.filter(keyword =>
      lower.includes(keyword.toLowerCase())
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
// GET RULE-BASED RESPONSE
// ============================================================

function getRuleResponse(intent) {

  return RULES[intent] ?? null;

}


// ============================================================
// CALL N8N WEBHOOK
// ============================================================
// The website sends the message and conversation history
// to n8n.
//
// n8n will then handle Claude / RAG / AI processing.
//
// IMPORTANT:
// DO NOT PUT YOUR ANTHROPIC API KEY HERE.
// ============================================================

async function getAIResponse(userMessage, history) {
  try {
    const response = await fetch(
      "https://dexiwi.app.n8n.cloud/webhook/rag-chatbot",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: userMessage,
          history: history
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        `n8n request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.reply) {
      throw new Error("No reply received from n8n");
    }

    return data.reply;

  } catch (error) {
    console.error("AI / n8n request error:", error);

    return "Sorry, I'm having trouble processing your request right now. Please try again.";
  }
}


// ============================================================
// CONVERSATION HISTORY
// ============================================================
// This is kept only while the webpage is open.
// Refreshing the page will clear the history.
// ============================================================

const conversationHistory = [];


// ============================================================
// MAIN MESSAGE HANDLER
// ============================================================

async function handleMessage(userMessage) {

  // ==========================================================
  // VALIDATE MESSAGE
  // ==========================================================

  if (
    !userMessage ||
    !userMessage.trim()
  ) {

    return "Please enter a message.";

  }


  // Remove unnecessary spaces
  userMessage = userMessage.trim();


  // ==========================================================
  // ADD USER MESSAGE TO HISTORY
  // ==========================================================

  conversationHistory.push({

    role: "user",

    content: userMessage

  });


  let reply;


  // ==========================================================
  // CLASSIFY INTENT
  // ==========================================================

  const {
    intent,
    confidence
  } = classifyIntent(userMessage);


  // ==========================================================
  // RULE-BASED RESPONSE
  // ==========================================================

  if (confidence === "high") {

    reply = getRuleResponse(intent);


    // ========================================================
    // IF NO RULE RESPONSE EXISTS
    // SEND TO N8N / AI
    // ========================================================

    if (!reply) {

      reply = await getAIResponse(

        userMessage,

        conversationHistory.slice(-10)

      );

    }

  }


  // ==========================================================
  // UNKNOWN QUESTION
  // SEND TO N8N / AI
  // ==========================================================

  else {

    reply = await getAIResponse(

      userMessage,

      conversationHistory.slice(-10)

    );

  }


  // ==========================================================
  // ADD ASSISTANT RESPONSE TO HISTORY
  // ==========================================================

  conversationHistory.push({

    role: "assistant",

    content: reply

  });


  // ==========================================================
  // RETURN RESPONSE TO YOUR CHAT UI
  // ==========================================================

  return reply;

}
