from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

import os
from uuid import uuid4
from datetime import datetime

import pandas as pd

from app.services.cloudinary_service import (
    upload_csv as upload_csv_to_cloudinary
)

from app.utils.profiler import (
    profile_dataframe
)

from app.services.duckdb_service import (
    load_csv_to_duckdb
)

from app.services.current_user_service import (
    get_current_user
)

from app.repositories.dataset_repository import (
    create_dataset
)

router = APIRouter()

UPLOAD_DIR = "uploads"


@router.post("/upload")
async def upload_csv(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    if not file.filename.endswith(".csv"):
        return {
            "status": "error",
            "message": "Only CSV files are allowed"
        }

    print(
        f"Received file: {file.filename} "
        f"from user: {current_user['name']}"
    )

    os.makedirs(
        UPLOAD_DIR,
        exist_ok=True
    )

    unique_filename = (
        str(uuid4())[:8]
        + "_"
        + file.filename
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    try:

        # ------------------------------------
        # Save Locally
        # ------------------------------------

        with open(
            file_path,
            "wb"
        ) as f:

            content = await file.read()

            f.write(content)

        # ------------------------------------
        # Read CSV
        # ------------------------------------

        df = pd.read_csv(
            file_path
        )

        # ------------------------------------
        # Generate Profile
        # ------------------------------------

        profile = profile_dataframe(
            df
        )

        # ------------------------------------
        # Generate Unique Table Name
        # ------------------------------------

        table_name = (
            file.filename
            .replace(".csv", "")
            .replace(" ", "_")
            + "_"
            + str(uuid4())[:8]
        )

        # ------------------------------------
        # Load Into DuckDB
        # ------------------------------------

        load_csv_to_duckdb(
            table_name=table_name,
            file_path=file_path
        )

        # ------------------------------------
        # Upload To Cloudinary
        # ------------------------------------

        file_url = upload_csv_to_cloudinary(
            file_path
        )

        # ------------------------------------
        # Save Dataset Record In MongoDB
        # ------------------------------------

        dataset_doc = {

            "user_id": current_user["id"],

            "filename": file.filename,

            "file_url": file_url,

            "table_name": table_name,

            "rows": len(df),

            "columns": len(
                df.columns
            ),

            "profile": profile,

            "created_at": datetime.utcnow()
        }

        dataset_result = create_dataset(
            dataset_doc
        )

        # ------------------------------------
        # Response
        # ------------------------------------

        return {

            "dataset_id": str(
                dataset_result.inserted_id
            ),

            "filename": file.filename,

            "file_url": file_url,

            "table_name": table_name,

            "rows": len(df),

            "columns": profile,

            "profile": profile,

            "status": "success"
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }

    finally:

        if os.path.exists(
            file_path
        ):
            os.remove(
                file_path
            )