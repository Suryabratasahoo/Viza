def serialize_dataset(dataset):
    return {
        "id": str(dataset["_id"]),
        "filename": dataset["filename"],
        "file_url": dataset.get("file_url"),
        "table_name": dataset["table_name"],
        "rows": dataset["rows"],
        "columns": dataset["columns"],
        "profile": dataset.get("profile", {}),
        "created_at": dataset["created_at"]
    }