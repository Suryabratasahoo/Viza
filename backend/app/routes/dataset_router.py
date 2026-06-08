from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from app.services.current_user_service import (
    get_current_user
)

from app.services.duckdb_service import (
    drop_table
)

from app.repositories.dataset_repository import (
    get_datasets_by_user,
    get_user_dataset,
    delete_user_dataset
)

from app.utils.dataset_serializer import (
    serialize_dataset
)

router = APIRouter()


@router.get("/datasets")
def get_datasets(
    current_user=Depends(
        get_current_user
    )
):

    datasets = get_datasets_by_user(
        current_user["id"]
    )

    return {
        "status": "success",
        "count": len(datasets),
        "datasets": [
            serialize_dataset(
                dataset
            )
            for dataset in datasets
        ]
    }


@router.get(
    "/datasets/{dataset_id}"
)
def get_dataset(
    dataset_id: str,
    current_user=Depends(
        get_current_user
    )
):

    dataset = get_user_dataset(
        dataset_id,
        current_user["id"]
    )

    if dataset is None:

        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    return {
        "status": "success",
        "dataset": serialize_dataset(
            dataset
        ),
        "schema": dataset.get(
            "profile",
            []
        )
    }


@router.delete(
    "/datasets/{dataset_id}"
)
def delete_dataset(
    dataset_id: str,
    current_user=Depends(
        get_current_user
    )
):

    dataset = get_user_dataset(
        dataset_id,
        current_user["id"]
    )

    if dataset is None:

        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    # Remove table from DuckDB

    drop_table(
        dataset["table_name"]
    )

    # Remove dataset record from MongoDB

    result = delete_user_dataset(
        dataset_id,
        current_user["id"]
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=400,
            detail="Failed to delete dataset"
        )

    return {
        "status": "success",
        "message": "Dataset deleted successfully",
        "dataset_id": dataset_id
    }