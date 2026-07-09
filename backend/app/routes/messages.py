from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.message import Message

messages_bp = Blueprint("messages", __name__)

def serialize(msg):
    msg["id"] = str(msg["_id"]); del msg["_id"]
    return msg

@messages_bp.route("/send", methods=["POST"])
@jwt_required()
def send():
    user_id = get_jwt_identity()
    data = request.get_json()
    data["sender_id"] = user_id
    msg_id = Message.send(data)
    return jsonify({"id": msg_id}), 201

@messages_bp.route("/inbox", methods=["GET"])
@jwt_required()
def inbox():
    user_id = get_jwt_identity()
    conversations = Message.get_inbox(user_id)
    result = []
    for c in conversations:
        lm = c["last_message"]
        lm["id"] = str(lm["_id"]); del lm["_id"]
        result.append({"with_user": c["_id"], "last_message": lm})
    return jsonify(result), 200

@messages_bp.route("/conversation/<other_user_id>", methods=["GET"])
@jwt_required()
def conversation(other_user_id):
    user_id = get_jwt_identity()
    msgs = Message.get_conversation(user_id, other_user_id)
    Message.mark_read(other_user_id, user_id)
    return jsonify([serialize(m) for m in msgs]), 200
