export default async function handler(req, res) {
  // 1. Handle CORS for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  const data = req.body;
  if (!data || (!data.message && !data.messages)) {
    return res.status(400).json({ success: false, error: "'message' or 'messages' required." })
  }

  // 2. Fetch Environment Variables
  const MODEL_ID = process.env.HF_MODEL_ID || "n99av80n/ppt-prompt-model-merged"
  const HF_TOKEN = process.env.HF_TOKEN

  if (!HF_TOKEN) {
    return res.status(500).json({ success: false, error: "HF_TOKEN environment variable is missing on Vercel." })
  }

  // 3. Format Messages for Qwen
  let messages = data.messages || [{ role: "user", content: data.message }];
  if (messages[0]?.role !== "system") {
    messages = [
      { 
        role: "system", 
        content: "You are an expert PowerPoint presentation designer. Generate a detailed, professional, and structured PowerPoint presentation prompt with slide-by-slide breakdown, design requirements, visual descriptions, and speaker notes." 
      },
      ...messages
    ];
  }

  let prompt = "";
  for (const msg of messages) {
    prompt += `<|im_start|>${msg.role}\n${msg.content}<|im_end|>\n`;
  }
  prompt += "<|im_start|>assistant\n";

  // 4. Call Hugging Face Serverless API
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: data.max_tokens || 1024,
          temperature: data.temperature || 0.7,
          top_p: data.top_p || 0.9,
          return_full_text: false,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API Error:", errorText);
      if (response.status === 503) {
        return res.status(503).json({ 
          success: false, 
          error: "Model is loading on Hugging Face. Please try again in 20 seconds." 
        });
      }
      return res.status(500).json({ success: false, error: "Hugging Face API Error" });
    }

    const result = await response.json();
    const generatedText = result[0]?.generated_text || "";
    
    return res.status(200).json({ success: true, response: generatedText.trim() });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
