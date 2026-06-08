from app.database.mongodb import db

db.test.insert_one({
    "message": "MongoDB Atlas Connected"
})

print("Connected Successfully")