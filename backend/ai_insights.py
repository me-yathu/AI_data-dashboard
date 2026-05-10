from google import genai
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_insights(data_summary: str, filename: str = "dataset") -> str:
    prompt = f"""
You are a friendly data analyst. A user has uploaded a CSV file called "{filename}".

Here is a statistical summary of the dataset:
{data_summary}

Give exactly 4 bullet point insights about this data.
Rules:
- Write in plain English that a non-technical person can understand
- Mention specific numbers wherever possible
- Highlight the most interesting or surprising pattern
- Each bullet point should be 1-2 sentences maximum
- Do NOT use markdown headers, just bullet points starting with •
- Keep the entire response under 200 words
    """.strip()

    try:
        response = client.models.generate_content(
            model="models/gemini-2.0-flash",
            contents=prompt
        )
        return response.text
    except Exception as e: 
        return f"• Could not generate AI insights at this time.\n• Error: {str(e)}\n• Please check your GEMINI_API_KEY in the .env file."


def ask_question(df: pd.DataFrame, question: str) -> str:
    data_preview = df.head(50).fillna("").to_string(index=False)
    col_info = f"Columns: {', '.join(df.columns.tolist())}"
    stats = df.describe(include="all").to_string() if not df.empty else ""

    prompt = f"""
You are a data analyst assistant. A user uploaded a dataset with this structure:

{col_info}
Total rows: {len(df)}

Sample data (first 50 rows):
{data_preview}

Statistical summary:
{stats}

User question: {question}

Answer the question clearly and specifically based only on the data above.
- Give a direct answer first
- Support it with specific numbers from the data
- If you cannot answer from the data, say so clearly
- Keep your answer under 120 words
- Do NOT use markdown formatting, just plain text
    """.strip()

    try:
        response = client.models.generate_content(
            model="models/gemini-2.0-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Could not generate answer: {str(e)}"