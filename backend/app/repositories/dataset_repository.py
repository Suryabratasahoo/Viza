from bson import ObjectId

from app.database.mongodb import db


def create_dataset(
    dataset_data: dict
):
    """
    Create a new dataset record.
    """

    return db.datasets.insert_one(
        dataset_data
    )


def get_dataset_by_id(
    dataset_id: str
):
    """
    Get a single dataset by its id.
    """

    return db.datasets.find_one(
        {
            "_id": ObjectId(
                dataset_id
            )
        }
    )


def get_datasets_by_user(
    user_id: str
):
    """
    Get all datasets uploaded by a user.
    """

    return list(
        db.datasets.find(
            {
                "user_id": user_id
            }
        ).sort(
            "created_at",
            -1
        )
    )


def delete_dataset(
    dataset_id: str
):
    """
    Delete a dataset by id.
    """

    return db.datasets.delete_one(
        {
            "_id": ObjectId(
                dataset_id
            )
        }
    )


def delete_user_dataset(
    dataset_id: str,
    user_id: str
):
    """
    Delete dataset only if it belongs
    to the requesting user.
    """

    return db.datasets.delete_one(
        {
            "_id": ObjectId(
                dataset_id
            ),
            "user_id": user_id
        }
    )


def dataset_exists(
    dataset_id: str
):
    """
    Check whether dataset exists.
    """

    return (
        db.datasets.count_documents(
            {
                "_id": ObjectId(
                    dataset_id
                )
            },
            limit=1
        )
        > 0
    )


def get_dataset_by_table_name(
    table_name: str
):
    """
    Useful for DuckDB lookups.
    """

    return db.datasets.find_one(
        {
            "table_name": table_name
        }
    )


def get_user_dataset(
    dataset_id: str,
    user_id: str
):
    """
    Get dataset only if it belongs
    to a specific user.
    """

    return db.datasets.find_one(
        {
            "_id": ObjectId(
                dataset_id
            ),
            "user_id": user_id
        }
    )
def delete_user_dataset(
    dataset_id: str,
    user_id: str
):

    return db.datasets.delete_one(
        {
            "_id": ObjectId(
                dataset_id
            ),
            "user_id": user_id
        }
    )