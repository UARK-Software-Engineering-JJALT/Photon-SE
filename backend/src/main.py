# src/main.py
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return {"message": "Hello, World!"}

@app.route("/hello")
def hellothere():
    return {"message": "Hello, there!"}

@app.route("/cow")
def moo():
    return {"message": "Moooo"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


