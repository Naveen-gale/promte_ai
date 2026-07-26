import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
from huggingface_hub import login

# Configuration
BASE_MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"
ADAPTER_ID = "n99av80n/ppt-prompt-model"
NEW_MODEL_ID = "n99av80n/ppt-prompt-model-merged"

def main():
    print("1. Loading Tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_ID, trust_remote_code=True)

    print(f"2. Loading Base Model ({BASE_MODEL_ID})...")
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_ID,
        torch_dtype=torch.float16,
        device_map="auto" if torch.cuda.is_available() else "cpu",
        trust_remote_code=True,
    )

    print(f"3. Loading Adapter ({ADAPTER_ID})...")
    peft_model = PeftModel.from_pretrained(base_model, ADAPTER_ID)

    print("4. Merging Weights...")
    model = peft_model.merge_and_unload()

    print(f"\n5. Pushing to Hugging Face ({NEW_MODEL_ID})...")
    
    # Automatically ask for the token in the script!
    hf_token = input("Please paste your Hugging Face Access Token (with Write permissions): ").strip()
    login(token=hf_token)
    
    try:
        model.push_to_hub(NEW_MODEL_ID)
        tokenizer.push_to_hub(NEW_MODEL_ID)
        print("✅ Successfully merged and pushed!")
        print(f"Your model is now available at: https://huggingface.co/{NEW_MODEL_ID}")
    except Exception as e:
        print("❌ Failed to push to Hugging Face. Did you run `huggingface-cli login`?")
        print(e)

if __name__ == "__main__":
    main()
