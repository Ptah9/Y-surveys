from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from os import environ

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def json(self):
        return {'id': self.id,'username': self.username, 'email': self.email}

class Poll(db.Model):
    __tablename__ = 'polls'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    options = db.relationship('Option', backref='poll', lazy=True)

class Option(db.Model):
    __tablename__ = 'options'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), nullable=False)
    votes = db.Column(db.Integer, default=0)
    poll_id = db.Column(db.Integer, db.ForeignKey('polls.id'), nullable=False)
    votes = db.relationship('Vote', backref='option', lazy=True)

class Vote(db.Model):
    __tablename__ = 'votes'

    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(45), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('options.id'), nullable=False)


db.create_all()

#create a test route
@app.route('/test', methods=['GET'])
def test():
  return make_response(jsonify({'message': 'test route'}), 200)


# create a user
@app.route('/users', methods=['POST'])
def create_user():
  try:
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()
    return make_response(jsonify({'message': 'user created'}), 201)
  except e:
    return make_response(jsonify({'message': 'error creating user'}), 500)

# get all users
@app.route('/users', methods=['GET'])
def get_users():
  try:
    users = User.query.all()
    return make_response(jsonify([user.json() for user in users]), 200)
  except e:
    return make_response(jsonify({'message': 'error getting users'}), 500)

# get a user by id
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
  try:
    user = User.query.filter_by(id=id).first()
    if user:
      return make_response(jsonify({'user': user.json()}), 200)
    return make_response(jsonify({'message': 'user not found'}), 404)
  except e:
    return make_response(jsonify({'message': 'error getting user'}), 500)

# update a user
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
  try:
    user = User.query.filter_by(id=id).first()
    if user:
      data = request.get_json()
      user.username = data['username']
      user.email = data['email']
      db.session.commit()
      return make_response(jsonify({'message': 'user updated'}), 200)
    return make_response(jsonify({'message': 'user not found'}), 404)
  except e:
    return make_response(jsonify({'message': 'error updating user'}), 500)

# delete a user
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
  try:
    user = User.query.filter_by(id=id).first()
    if user:
      db.session.delete(user)
      db.session.commit()
      return make_response(jsonify({'message': 'user deleted'}), 200)
    return make_response(jsonify({'message': 'user not found'}), 404)
  except e:
    return make_response(jsonify({'message': 'error deleting user'}), 500)
  

@app.route('/polls', methods=['POST'])
def create_poll():
    try:
        data = request.get_json()
        user = User.query.filter_by(id=data['user_id']).first()
        if user:
            new_poll = Poll(title=data['title'], user_id=user.id)
            db.session.add(new_poll)
            db.session.commit()
            for option in data['options']:
                new_option = Option(text=option, poll_id=new_poll.id)
                db.session.add(new_option)
            db.session.commit()
            return make_response(jsonify({'message': 'Poll created'}), 201)
        return make_response(jsonify({'message': 'User not found'}), 404)
    except e:
        return make_response(jsonify({'message': 'Error creating poll'}), 500)

@app.route('/polls/<int:poll_id>/options/<int:option_id>/vote', methods=['POST'])
def vote(poll_id, option_id):
    try:
        option = Option.query.filter_by(id=option_id).first()
        if option:
            ip_address = request.remote_addr
            existing_vote = Vote.query.filter_by(ip_address=ip_address, option_id=option_id).first()
            if not existing_vote:
                new_vote = Vote(ip_address=ip_address, option_id=option_id)
                db.session.add(new_vote)
                option.votes += 1
                db.session.commit()
                return make_response(jsonify({'message': 'Vote recorded'}), 200)
            return make_response(jsonify({'message': 'You have already voted for this option'}), 409)
        return make_response(jsonify({'message': 'Option not found'}), 404)
    except e:
        return make_response(jsonify({'message': 'Error recording vote'}), 500)

@app.route('/polls/<int:id>', methods=['DELETE'])
def delete_poll(id):
    try:
        poll = Poll.query.filter_by(id=id).first()
        if poll:
            db.session.delete(poll)
            db.session.commit()
            return make_response(jsonify({'message': 'Poll deleted'}), 200)
        return make_response(jsonify({'message': 'Poll not found'}), 404)
    except e:
        return make_response(jsonify({'message': 'Error deleting poll'}), 500)

@app.route('/polls/<int:poll_id>', methods=['GET'])
def get_poll(poll_id):
    try:
        poll = Poll.query.filter_by(id=poll_id).first()
        if poll:
            options = []
            for option in poll.options:
                options.append({
                    'id': option.id,
                    'text': option.text,
                    'votes': option.votes
                })
            response = {
                'id': poll.id,
                'title': poll.title,
                'options': options
            }
            return make_response(jsonify(response), 200)
        return make_response(jsonify({'message': 'Poll not found'}), 404)
    except e:
        return make_response(jsonify({'message': 'Error getting poll'}), 500)