import https from 'https';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  const data = req.body;
  if (!data || (!data.message && !data.messages)) {
    return res.status(400).json({ success: false, error: "'message' or 'messages' required." })
  }

  // Keep the serverless fallback aligned with the model used by the LoRA adapter.
  const MODEL_ID = process.env.HF_MODEL_ID || "Qwen/Qwen2.5-0.5B-Instruct"
  const HF_PROVIDER = process.env.HF_PROVIDER
  const HF_TOKEN = process.env.HF_TOKEN

  if (!HF_TOKEN) {
    return res.status(500).json({ success: false, error: "HF_TOKEN environment variable is missing on Vercel." })
  }

  // Build messages array (OpenAI format)
  let messages = data.messages || [{ role: "user", content: data.message }];
  if (!messages[0] || messages[0].role !== "system") {
    messages = [
      {
        role: "system",
        content: "You are an expert PowerPoint presentation designer. Generate a detailed, professional, and structured PowerPoint presentation prompt with slide-by-slide breakdown, design requirements, visual descriptions, and speaker notes."
      },
      ...messages
    ];
  }

  // The provider is optional: omit it to let Hugging Face choose an enabled
  // provider, or set HF_PROVIDER in Vercel when a specific provider is needed.
  const body = JSON.stringify({
    model: MODEL_ID,
    messages: messages,
    max_tokens: data.max_tokens || 1024,
    temperature: data.temperature || 0.7,
    top_p: data.top_p || 0.9,
    ...(HF_PROVIDER ? { provider: HF_PROVIDER } : {}),
  });

  try {
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'router.huggingface.co',
        path: '/v1/chat/completions', // generic router → routes through Novita AI (enabled in HF settings)
        method: 'POST',
        family: 4, // FORCE IPv4 — fixes ENOTFOUND on Vercel
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        }
      };

      const req_hf = https.request(options, (resp) => {
        let raw = '';
        resp.on('data', chunk => raw += chunk);
        resp.on('end', () => {
          try {
            resolve({ status: resp.statusCode, data: JSON.parse(raw) });
          } catch {
            resolve({ status: resp.statusCode, data: raw });
          }
        });
      });

      req_hf.on('error', reject);
      req_hf.write(body);
      req_hf.end();
    });

    if (result.status === 503) {
      return res.status(503).json({ success: false, error: "Model is loading on Hugging Face. Please try again in 20 seconds." });
    }

    if (result.status !== 200) {
      console.error("HF Error:", result.data);
      return res.status(500).json({ success: false, error: "Hugging Face API Error: " + JSON.stringify(result.data) });
    }

    const generatedText = result.data?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ success: true, response: generatedText.trim() });

  } catch (error) {
    console.error("Request Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
