import pandas as pd


def determine_role(df, col):

    dtype = str(df[col].dtype)

    unique_count = df[col].nunique()

    row_count = len(df)

    ratio = unique_count / row_count

    column_name = col.lower()

    # Strong identifier detection
    identifier_keywords = [
        "id",
        "_id",
        "uuid",
        "key"
    ]

    if any(
        keyword in column_name
        for keyword in identifier_keywords
    ):
        return "identifier"

    # Numeric columns are usually measures
    if dtype in [
        "int64",
        "float64",
        "int32",
        "float32"
    ]:
        return "measure"

    # High uniqueness string columns
    if ratio > 0.95:
        return "identifier"

    # Default
    return "dimension"


def get_sample_values(df, col):

    values = (
        df[col]
        .dropna()
        .astype(str)
        .unique()
        .tolist()
    )

    return values[:5]


def profile_dataframe(df):

    profile = []

    for col in df.columns:

        role = determine_role(df, col)

        column_info = {
            "name": col,
            "dtype": str(df[col].dtype),
            "null_count": int(df[col].isnull().sum()),
            "unique_count": int(df[col].nunique()),
            "role": role
        }

        # Add sample values for dimensions
        if role == "dimension":

            column_info["sample_values"] = (
                get_sample_values(df, col)
            )

        profile.append(column_info)

    return profile