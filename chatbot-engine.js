// Classify intent from user message
function classifyIntent(message) {
  const lower = message.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [intent, data] of Object.entries(INTENTS)) {
    const score = data.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  return bestScore >= 1
    ? { intent: bestMatch, confidence: "high" }
    : { intent: "unknown", confidence: "low" };
}

// Get rule-based response
function getRuleResponse(intent) {
  return RULES[intent] ?? null;
}

// Call Claude AI for unknown questions
async function getAIResponse(userMessage, history) {
  const messages = [...history, { role: "user", content: userMessage }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: "You are a helpful, friendly assistant for this website. Keep answers short and clear.",
      messages: messages,
    }),
  });

  const data = await res.json();
  return data.content[0].text;
}

// Conversation history (kept in memory while page is open)
const conversationHistory = [];

// Main handler — call this on every user message
async function handleMessage(userMessage) {
  conversationHistory.push({ role: "user", content: userMessage });

  let reply;
  const { intent, confidence } = classifyIntent(userMessage);

  if (confidence === "high") {
    reply = getRuleResponse(intent);
  } else {
    reply = await getAIResponse(userMessage, conversationHistory.slice(-10));
  }

  conversationHistory.push({ role: "assistant", content: reply });
  return reply;
}// Classify intent from user message
function classifyIntent(message) {
  const lower = message.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [intent, data] of Object.entries(INTENTS)) {
    const score = data.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  return bestScore >= 1
    ? { intent: bestMatch, confidence: "high" }
    : { intent: "unknown", confidence: "low" };
}

// Get rule-based response
function getRuleResponse(intent) {
  return RULES[intent] ?? null;
}

// Call Claude AI for unknown questions
async function getAIResponse(userMessage, history) {
  const messages = [...history, { role: "user", content: userMessage }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: "You are a helpful, friendly assistant for this website. Keep answers short and clear.",
      messages: messages,
    }),
  });

  const data = await res.json();
  return data.content[0].text;
}

// Conversation history (kept in memory while page is open)
const conversationHistory = [];

// Main handler — call this on every user message
async function handleMessage(userMessage) {
  conversationHistory.push({ role: "user", content: userMessage });

  let reply;
  const { intent, confidence } = classifyIntent(userMessage);

  if (confidence === "high") {
    reply = getRuleResponse(intent);
  } else {
    reply = await getAIResponse(userMessage, conversationHistory.slice(-10));
  }

  conversationHistory.push({ role: "assistant", content: reply });
  return reply;
}