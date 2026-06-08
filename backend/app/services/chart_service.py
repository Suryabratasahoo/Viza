import pandas as pd


def detect_chart_type(df: pd.DataFrame) -> dict:
    """
    Analyze a query result DataFrame and recommend
    the most appropriate visualization.
    """

    row_count = len(df)

    if row_count == 0:
        return {
            "type": "Table",
            "confidence": 1.0,
            "reason": "No data returned."
        }

    numeric_cols = []
    temporal_cols = []
    categorical_cols = []

    # -----------------------------
    # Column Classification
    # -----------------------------

    for col in df.columns:

        dtype = df[col].dtype

        # Numeric
        if (
            pd.api.types.is_numeric_dtype(dtype)
            and not pd.api.types.is_bool_dtype(dtype)
        ):
            numeric_cols.append(col)

        # Temporal
        elif (
            pd.api.types.is_datetime64_any_dtype(dtype)
            or "date" in col.lower()
            or "time" in col.lower()
            or "month" in col.lower()
            or "year" in col.lower()
        ):
            temporal_cols.append(col)

        # Categorical
        else:
            categorical_cols.append(col)

    num_n = len(numeric_cols)
    num_t = len(temporal_cols)
    num_c = len(categorical_cols)

    # -----------------------------
    # Time Series
    # -----------------------------

    if num_t >= 1 and num_n >= 1:

        return {
            "type": "LineChart",
            "x": temporal_cols[0],
            "y": numeric_cols,
            "confidence": 0.98,
            "reason": (
                "Temporal dimension with "
                "numeric metrics detected."
            )
        }

    # -----------------------------
    # Scatter Plot
    # -----------------------------

    if (
        num_n == 2
        and num_c == 0
        and num_t == 0
    ):

        return {
            "type": "ScatterPlot",
            "x": numeric_cols[0],
            "y": numeric_cols[1],
            "confidence": 0.95,
            "reason": (
                "Two numeric columns "
                "suggest correlation analysis."
            )
        }

    # -----------------------------
    # Category vs Metric
    # -----------------------------

    if num_c == 1 and num_n == 1:

        category_col = categorical_cols[0]
        metric_col = numeric_cols[0]

        distinct_count = (
            df[category_col]
            .nunique()
        )

        # Pie chart for small category counts
        if distinct_count <= 4:

            return {
                "type": "PieChart",
                "labels": category_col,
                "values": metric_col,
                "confidence": 0.90,
                "reason": (
                    "Small number of categories "
                    "representing parts of a whole."
                )
            }

        return {
            "type": "BarChart",
            "x": category_col,
            "y": metric_col,
            "confidence": 0.95,
            "reason": (
                "Comparing values across "
                "multiple categories."
            )
        }

    # -----------------------------
    # Grouped Bar
    # -----------------------------

    if num_c == 2 and num_n == 1:

        return {
            "type": "GroupedBarChart",
            "x": categorical_cols[0],
            "group": categorical_cols[1],
            "y": numeric_cols[0],
            "confidence": 0.92,
            "reason": (
                "Comparing a metric across "
                "primary and secondary categories."
            )
        }

    # -----------------------------
    # Multiple Metrics
    # -----------------------------

    if num_c == 1 and num_n > 1:

        return {
            "type": "MultiBarChart",
            "x": categorical_cols[0],
            "y": numeric_cols,
            "confidence": 0.90,
            "reason": (
                "Multiple metrics available "
                "for each category."
            )
        }

    # -----------------------------
    # Fallback
    # -----------------------------

    return {
        "type": "Table",
        "confidence": 0.80,
        "reason": (
            f"Complex structure "
            f"(C:{num_c}, N:{num_n}, T:{num_t}) "
            "better represented as a table."
        )
    }