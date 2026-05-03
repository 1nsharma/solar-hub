import os
from dotenv import load_dotenv
from huggingface_hub import login
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments

# 1. Securely load the Hugging Face token from the .env file
load_dotenv(dotenv_path="../.env")
hf_token = os.getenv("HF_TOKEN")

if not hf_token:
    raise ValueError("HF_TOKEN not found in .env file. Please ensure it is set.")

# Authenticate with Hugging Face
login(token=hf_token)
print("Successfully authenticated with Hugging Face!")

def train_model():
    """
    Example script to fetch a dataset from Hugging Face and train a simple model.
    You should replace 'dataset_name' and 'model_name' with your specific requirements.
    """
    # 2. Fetch data from Hugging Face
    # Replace 'imdb' with your desired dataset (e.g., a custom solar text dataset)
    dataset_name = "imdb" 
    print(f"Fetching dataset: {dataset_name}...")
    
    # We load a small portion for demonstration purposes
    dataset = load_dataset(dataset_name, split='train[:1%]') 
    
    # 3. Load a tokenizer and model
    # Replace with the model you want to fine-tune
    model_name = "distilbert-base-uncased"
    print(f"Loading model and tokenizer: {model_name}...")
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

    # 4. Preprocess the dataset
    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True)

    tokenized_datasets = dataset.map(tokenize_function, batched=True)

    # 5. Set up Training Arguments
    training_args = TrainingArguments(
        output_dir="./results",
        learning_rate=2e-5,
        per_device_train_batch_size=8,
        num_train_epochs=1,
        weight_decay=0.01,
        # logging_steps=10,
    )

    # 6. Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets,
    )

    # 7. Start Training
    print("Starting training...")
    # Uncomment the line below to actually run the training loop
    # trainer.train()
    print("Training setup complete! Customize the dataset and model, then uncomment trainer.train() to begin.")

if __name__ == "__main__":
    train_model()
