from flask import Flask, Response, request 
from pymongo import MongoClient
from bson import json_util, ObjectId

app = Flask(__name__)

client = MongoClient()

db = client['ToDo']
collection = db['tasks']


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/add/task', methods=['POST'])
def add_task():
    data = request.get_json()
    task = data['task']
    completed = data['completed']
    result = collection.insert_one({'task' : task, 'completed' : completed})
    _id = result.inserted_id
    if _id:
        print(_id)
        response_data = {"success": True, "message": "Task added successfully", "task_id": str(_id)}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 201
    response_data = {"success": False}
    return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 500

if __name__ == '__main__':
    app.run(debug=True)