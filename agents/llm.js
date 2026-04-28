const OpenAI = require('openai');

/** DeepSeek 使用 OpenAI 兼容接口：https://api.deepseek.com */
function createClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY');
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  });
}

async function chatCompletion({ messages, max_tokens }) {
  const client = createClient();
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const response = await client.chat.completions.create({
    model,
    max_tokens,
    messages
  });
  const text = response.choices[0]?.message?.content;
  if (text == null || text === '') {
    throw new Error('Empty completion from DeepSeek');
  }
  return text;
}

/** 模型有时会在 JSON 外包一层 ```json ... ``` */
function parseJsonLoose(raw) {
  let t = raw.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
  }
  return JSON.parse(t);
}

module.exports = { chatCompletion, parseJsonLoose };
