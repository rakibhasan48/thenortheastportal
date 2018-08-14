from flask import Flask, jsonify, request
from Sentimental_Analysis import Sentiment
from comment import Comment
import make_report
from flask_httpauth import HTTPBasicAuth
from abuse import Abuse
import json
from info import API_KEY,API_USERNAME
import __init__


app = Flask(__name__)
auth = HTTPBasicAuth()
abuse = Abuse()


@auth.get_password
def get_password(username):
    if username == API_USERNAME:
        return API_KEY
    return None


@auth.error_handler
def unauthorized():
    return jsonify({'error': 'Unauthorized access'}), 401


@app.route("/check_abuse", methods=["POST"])
@auth.login_required
def check_abuse():
    if not request.json:
        return jsonify({"error": "no data"}), 422
    if not "text" in request.json:
        return jsonify({"error": "need full data list message"}), 422

    json_req = json.loads(request.json)

    text = json_req["text"]
    # text = request.json['text']
    result = abuse.checkAbuse(text=text)
    return jsonify({"result": result})


@app.route("/report", methods=["POST"])
@auth.login_required
def send_report():
    if not request.json:
        return jsonify({"error": "no data"}), 422
    if not "ministry_name" in request.json and not "project_name" in request.json and not "comments" in request.json and not "email" in request.json:
        return jsonify({"error": "need full data list ministry name, project name,comments,time stamp,email"}), 422

    # json_req = json.loads(request.json)
    #
    # ministry = json_req["ministry"]
    # project = json_req["project"]
    # comments = json_req["comments"]
    # email = json_req["email"]
    # time_stamp = json_req["time_stamp"]

    ministry = request.json["ministry"]
    project = request.json["project"]
    comments = request.json["comments"]
    email = request.json["email"]
    time_stamp = request.json["time_stamp"]

    comments = comments.split(",")
    time_stamp = time_stamp.split(",")
    Obj = []
    if not len(comments) == len(time_stamp):
        return jsonify({"error": "length of time stamp must be same of comments"}), 501

    for i in range(len(comments)):
        c = Comment(text=comments[i], time=time_stamp[i], sentiment=Sentiment.get_sentiment(comments[i]))
        Obj.append(c)
    result, _ = make_report.start(comments=Obj, report_name=project, ministry=ministry, project=project, email=email)

    return jsonify({"sucess": result})


if __name__ == "__main__":
    app.run(debug=True)
