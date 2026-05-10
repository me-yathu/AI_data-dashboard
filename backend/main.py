from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from analyzer import analyze_csv
from ai_insights import get_insights, ask_question
import pandas as pd
import io
import json

app = FastAPI(title="AI Data Dashboard API")

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store current dataframe in memory (per server session)
session = {}


@app.get("/")
def root():
    return {"status": "AI Data Dashboard API is running"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Accept a CSV file, analyse it with Pandas,
    generate charts, and return AI insights from Gemini.
    """
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read CSV: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    # Save dataframe for follow-up questions
    session["df"] = df.to_dict(orient="records")
    session["filename"] = file.filename

    # Run analysis
    analysis = analyze_csv(df)

    # Get AI insights from Gemini
    ai_insight = get_insights(analysis["summary"], file.filename)

    return {
        "filename": file.filename,
        "columns": analysis["columns"],
        "row_count": analysis["row_count"],
        "col_count": len(analysis["columns"]),
        "numeric_cols": analysis["numeric_cols"],
        "text_cols": analysis["text_cols"],
        "charts": analysis["charts"],
        "summary": analysis["summary"],
        "ai_insight": ai_insight,
        "preview": analysis["preview"],
    }


@app.post("/ask")
async def ask(body: dict):

    try:
        question = body.get("question", "").strip()

        if not question:
            return {"answer": "Please enter a question"}

        if "df" not in session:
            return {"answer": "Please upload a CSV file first"}

        df = pd.DataFrame(session["df"])

        if df.empty:
            return {"answer": "Dataset is empty. Please upload again."}

        answer = ask_question(df, question)

        return {"answer": answer}

    except Exception as e:
        print("ASK ERROR:", str(e))
        return {"answer": f"Server error: {str(e)}"}
    
