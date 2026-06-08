from app.database.mongodb import db
from bson import ObjectId

def create_user(user_data: dict):
    return db.users.insert_one(user_data)


def get_user_by_email(email: str):
    return db.users.find_one(
        {"email": email}
    )


def get_user_by_id(user_id: str):
    return db.users.find_one(
        {"_id": user_id}
    )
    
    
def update_user(
    user_id: str,
    update_data: dict
):

    return db.users.update_one(
        {
            "_id": ObjectId(
                user_id
            )
        },
        {
            "$set": update_data
        }
    )