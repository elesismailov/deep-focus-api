from mongoengine import *

class Users(Document):
	username = StringField(max_length=20, required=True)
	email = StringField(required=True, unique=True)
	password = StringField(required=True)
	entries = ListField(
		ListField()
	)
	# entry: [id, startTime, endTime, ...]