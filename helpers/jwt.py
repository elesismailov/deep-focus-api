
import jwt, os

def createJWT(username, email):

	token = jwt.encode(
		{'username': username, 'email': email},
		os.environ.get('SECRET'),
		algorithm='HS256'
	)

	return token