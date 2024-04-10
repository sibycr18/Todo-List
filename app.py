from flask import Flask
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
    pass

if __name__ == '__main__':
    app.run()