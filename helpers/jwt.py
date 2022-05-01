
import jwt
import os

def createJWT(username, email):


	token = jwt.encode({'username': username, 'email': email}, os.environ.get('SECRET'))

	return token