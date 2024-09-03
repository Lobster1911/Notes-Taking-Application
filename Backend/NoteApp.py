import bcrypt
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS
from flask import redirect, url_for

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
mongo = PyMongo(app)
notes_collection = mongo.db.notes

# Create Note
@app.route('/api/notes', methods=['POST'])
def create_note():
    data = request.json
    title = data.get('title')
    body = data.get('body')
    if not title or not body:
        return jsonify({'error': 'Title and body are required'}), 400
    note_id = notes_collection.insert_one({'title': title, 'body': body}).inserted_id
    return jsonify({'message': 'Note created', 'note_id': str(note_id)}), 201

# Get all notes
@app.route('/api/notes', methods=['GET'])
def get_notes():
    notes = list(notes_collection.find())
    for note in notes:
        note['_id'] = str(note['_id'])
    return jsonify(notes)

# View Note
@app.route('/api/notes/<note_id>', methods=['GET'])
def view_note(note_id):
    if not ObjectId.is_valid(note_id):
        return jsonify({'error': 'Invalid note ID format'}), 400

    note = notes_collection.find_one({'_id': ObjectId(note_id)})
    if not note:
        return jsonify({'error': 'Note not found'}), 404

    note['_id'] = str(note['_id'])  # Convert ObjectId to string
    return jsonify(note)



# Update a note
@app.route('/api/notes/<note_id>', methods=['PUT'])
def update_note(note_id):
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided for update'}), 400
    # Exclude the _id field from the update data
    data.pop('_id', None)
    result = notes_collection.update_one({'_id': ObjectId(note_id)}, {'$set': data})
    if result.modified_count == 0:
        return jsonify({'error': 'Note not found'}), 404
    return jsonify({'message': 'Note updated'}), 200


# Delete a note
@app.route('/api/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    result = notes_collection.delete_one({'_id': ObjectId(note_id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Note not found'}), 404
    return jsonify({'message': 'Note deleted'}), 200

# Route for serving favicon
@app.route('/favicon.ico')
def favicon():
    return ''



@app.route("/")
def redirect_to_api():
    return redirect(url_for("show_all_music"))


if __name__ == '__main__':
    app.run(debug=True)
