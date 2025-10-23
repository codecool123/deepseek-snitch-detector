import { pipeline } from '@xenova/transformers';

// Load LLaMA model for text generation (quantized/small recommended for browser)
let generator = null;
export async function loadModel() {
  if (!generator) {
    generator = await pipeline('text-generation', 'Xenova/llama-7b-4bit');
  }
  return generator;
}

export async function generateText(prompt, max_new_tokens = 80) {
  const model = await loadModel();
  const output = await model(prompt, { max_new_tokens, temperature: 0.7 });
  return output[0].generated_text.trim();
}