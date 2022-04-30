
def connectMongoDb():
	from mongoengine import connect 
	from os import environ
	from models.user import User

	mongoUri = environ.get('MONGODB_URI')
	mongoDb = environ.get('MONGODB_DB')
	mongoUser = environ.get('MONGODB_USER')
	mongoPassword = environ.get('MONGODB_PASS')

	connect(
		db=mongoDb,
		username=mongoUser,
		password=mongoPassword,
		host=mongoUri
	)

	# add db models here

	print('MongoDB connection established...')
