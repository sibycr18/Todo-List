from flask import Flask, Response, request 
from pymongo import MongoClient
from bson import json_util, ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient()

db = client['ToDo']
collection = db['tasks']


@app.route('/')
def hello_world():
    return 'Welcome to ToDo App'

# add task end point
@app.route('/add/task', methods=['POST'])
def add_task():
    data = request.get_json()
    task = data['task']
    result = collection.insert_one({'task' : task, 'completed' : False})
    _id = result.inserted_id
    if _id:
        response_data = {"success": True, "message": "Task added successfully", "task_id": str(_id)}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 201
    response_data = {"success": False}
    return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 500

# mark as complete end point
@app.route('/mark/complete', methods=['PUT'])
def mark_complete():
    data = request.get_json()
    _id = ObjectId(data['id'])
    result = collection.update_one({"_id": ObjectId(_id)}, {"$set": {"completed": True}})
    if result.modified_count > 0:
        response_data = {"success": True, "message": "Marked as completed"}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 201
    response_data = {"success": False}
    return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 500

# fetch tasks
@app.route('/fetch/tasks', methods=['GET'])
def fetch_tasks():
    try:
        # Find all documents in the collection
        result = list(collection.find({"completed": False}))
        for tasks in result:
            tasks["_id"] = str(tasks["_id"])

        response_data = {"success": True, "tasks" : result}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 201
    except:
        response_data = {"success": False}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 500
    

if __name__ == '__main__':
    app.run(debug=True)