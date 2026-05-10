import pandas as pd
import json


def analyze_csv(df: pd.DataFrame) -> dict:
    """
    Analyse a dataframe and return chart data, column info, and a text summary.
    """
    columns = list(df.columns)
    row_count = len(df)

    # Separate numeric and text columns
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    text_cols = df.select_dtypes(include="object").columns.tolist()
    date_cols = df.select_dtypes(include=["datetime"]).columns.tolist()

    charts = []

    # --- Bar chart: first text column vs first numeric column ---
    if text_cols and numeric_cols:
        col_text = text_cols[0]
        col_num = numeric_cols[0]
        grouped = df.groupby(col_text)[col_num].sum().reset_index()
        grouped = grouped.sort_values(col_num, ascending=False).head(10)
        charts.append({
            "type": "bar",
            "title": f"{col_num} by {col_text}",
            "x_key": col_text,
            "y_key": col_num,
            "data": grouped.to_dict(orient="records"),
        })

    # --- Line chart: index vs numeric columns (trend over rows) ---
    if numeric_cols:
        col_num = numeric_cols[0]
        sample = df[[col_num]].head(30).reset_index()
        sample.columns = ["index", col_num]
        charts.append({
            "type": "line",
            "title": f"{col_num} trend (first 30 rows)",
            "x_key": "index",
            "y_key": col_num,
            "data": sample.to_dict(orient="records"),
        })

    # --- Pie chart: value counts of first text column ---
    if text_cols:
        col_text = text_cols[0]
        counts = df[col_text].value_counts().head(6).reset_index()
        counts.columns = ["name", "value"]
        charts.append({
            "type": "pie",
            "title": f"Breakdown by {col_text}",
            "data": counts.to_dict(orient="records"),
        })

    # --- Second bar chart if we have a second numeric column ---
    if len(numeric_cols) >= 2 and text_cols:
        col_text = text_cols[0]
        col_num = numeric_cols[1]
        grouped2 = df.groupby(col_text)[col_num].mean().reset_index()
        grouped2 = grouped2.sort_values(col_num, ascending=False).head(8)
        charts.append({
            "type": "bar",
            "title": f"Average {col_num} by {col_text}",
            "x_key": col_text,
            "y_key": col_num,
            "data": grouped2.to_dict(orient="records"),
        })

    # Build summary text for AI prompt
    stats_text = ""
    if numeric_cols:
        stats = df[numeric_cols].describe()
        stats_text = stats.to_string()

    # Top categories
    top_cats = ""
    if text_cols:
        for tc in text_cols[:2]:
            top = df[tc].value_counts().head(5)
            top_cats += f"\n{tc} top values: {', '.join(map(str, top.index.tolist()))}"

    summary = f"""
Dataset: {row_count} rows, {len(columns)} columns
Columns: {', '.join(columns)}
Numeric columns: {', '.join(numeric_cols) if numeric_cols else 'None'}
Text columns: {', '.join(text_cols) if text_cols else 'None'}
{top_cats}

Numeric statistics:
{stats_text}
    """.strip()

    # Preview: first 5 rows as list of dicts
    preview = df.head(5).fillna("").to_dict(orient="records")

    return {
        "columns": columns,
        "row_count": row_count,
        "numeric_cols": numeric_cols,
        "text_cols": text_cols,
        "charts": charts,
        "summary": summary,
        "preview": preview,
    }
