from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
from datetime import date
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timedelta
from model import *
import random
from bson import json_util
from faker import Faker




app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

jwt = JWTManager(app)
DB = 'mongodb+srv://curioussid:curioussid@eventtracking.cfkcoeg.mongodb.net/eventTracking?retryWrites=true&w=majority'

client = MongoClient(DB)
db = client.eventTracking


# @app.route('/api/upload', methods=['POST'])
# def upload():
#     try:
#         file = request.files['file']
#         filename = file.filename
#         file.save(
#             '/home/siddhant/Documents/FinalProject/backend/images/' + filename)
#         return {"message": "File saved successfully!"}, 200
#     except Exception as e:
#         print(e)
#         return {"Error": e}
#     # ... handle the uploaded file here

@app.route('/api/upload', methods=['POST'])
def upload():
    try:
        eventData = list(db.events.find({}))
        event_id = eventData[len(eventData) - 1]['event_id']
        file = request.files['file']
        filename = file.filename
        filename = str(event_id) + '.jpg'
        file.save(
            '/home/siddhant/Documents/FinalProject/backend/images/' + filename)
        return {"message": "File saved successfully!"}, 200
    except Exception as e:
        print(e)
        return {"Error": e}
    # ... handle the uploaded file here


@app.route('/api/uploads/<name>')
def display_file(name):
    return send_from_directory('/home/siddhant/Documents/FinalProject/backend/images/', name)


@app.route('/signup', methods=['POST'])
def Signup():
    global Username
    data = request.json
    password = request.json.get("password", None)
    password = generate_password_hash(password)
    data['password'] = password
    userData = list(db.user.find({}))
    print(userData)
    data['user_id'] = userData[len(userData) - 1]['user_id'] + 1
    User = db.user
    result = User.insert_one(data)
    access_token = create_access_token(identity=data["username"])
    return jsonify(access_token=access_token, firstname=data["firstname"], user_id=data['user_id'], status=200)


@app.route('/addEvent', methods=['POST'])
@jwt_required()
def AddEvent():

    try:
        data = request.json
        print(data)
        eventData = list(db.events.find({}))
        print(eventData)
        data['event_id'] = eventData[len(eventData) - 1]['event_id'] + 1
        response = db.events.insert_one(data)
        print("Data : ", data)
        return {"status": "200"}
    except Exception as e:
        print("Error=>", e)
        return {"status": "500"}


@app.route('/getEvents', methods=['GET'])
def GetEvents():

    user_id = int(request.args.get('user_id'))
    page_num = int(request.args.get('page_number'))
    n = 10
    page_size = 10
    events = get_recommended_events(user_id, n, page_num, page_size)
    # print("events : ",events)
    return events


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    user = db.user.find_one({"username": username})

    if not username or not password:
        return jsonify({"message": "Username and password are required."}), 400

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"message": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    print("Access Token : ", access_token)
    return jsonify(access_token=access_token, firstname=user["firstname"], user_id=user['user_id'], status=200)


@app.route("/addComment", methods=["POST"])
def AddComment():
    try:
        event_id = request.json.get("event_id", None)
        user_id = request.json.get("user_id", None)
        comment = request.json.get("comment", None)
        comments = list(db.events.find({"event_id": event_id}))
        if 'comments' in comments[0]:
            comments = comments[0]['comments']
        else:
            comments = []

        comments.append({"user_id": user_id, "comment": comment})
        resp = db.events.update_many({"event_id": event_id}, {
                                     "$set": {"comments": comments}})
        return jsonify(message="Comment added successfully!"), 200
    except Exception as e:
        return jsonify(message="Something went wrong!"), 500


@app.route("/addLike", methods=["POST"])
def AddLike():
    try : 
        event_id = request.json.get("event_id", None)
        user_id = request.json.get("user_id", None)
        likes = list(db.events.find({"event_id": event_id}))

        if 'likes' in likes[0]:
            likes = likes[0]['likes']
        else:
            likes = []

        liked = filter(lambda item: item['user_id'] == user_id, likes)
        liked = list(liked)
        rating = 1
        if (len(liked) == 1):
            print("liked rating : ", liked[0]['rating'])
            if (liked[0]['rating'] == 1):
                rating = 0
        likes = list(filter(lambda item: item['user_id'] != user_id, likes))
        likes.append({"user_id": user_id, "rating": rating})
        resp = db.events.update_one({"event_id": event_id}, {
                                    "$set": {"likes": likes}})
        return jsonify(message="like added successfully!"), 200
    except Exception as e:
        print(e)
        return jsonify(message="like went wrong!"), 500


@app.route('/searchEvents', methods=["GET"])
def searchEvents():
    try:
        word = request.headers.get('text')
        # word = f'/{word}/i'
        resp = db.events.find(
            {'$or': [{'event_name': {'$regex': word}}, {'location': {'$regex': word}}]})
        resp = list(resp)
        return json.loads(json_util.dumps(resp)), 200
    except Exception as e:
        print(e)
        return jsonify(message="search went wrong!"), 500


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    try:
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        # Use the user_id to retrieve the user from the database
        current_user = db.user.find_one({'email': user_id})
        firstname = current_user['firstname']
        lastname = current_user['lastname']
        email = current_user['email']
        username = current_user['username']
        user_id = current_user['user_id']
        return jsonify(firstname=firstname, lastname=lastname, email=email, username=username, user_id=user_id), 200
    except Exception as e:
        return jsonify(message="Unauthorised"), 500


if __name__ == '__main__':
    app.run(debug=True)
