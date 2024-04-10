from flask import Flask, Response, request 
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient()

db = client['To-do list']
collection = db['tasks']


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/add/task', methods=['POST'])
def add_task():
    data = request.get_json()
    task = data['task']
    completed = data['completed']
    _id = collection.insert_one({'task' : task, 'completed' : completed})
    if _id:
        response_data = {'success': True, 'message': 'Task added successfully', 'task_id': _id}
        return Response(response_data)
    response_data = {'success': False}
    return Response(response_data)

if __name__ == '__main__':
    app.run()