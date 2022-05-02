

from flask_restful import Resource, reqparse
from models.user import Users
from helpers.jwt import createJWT
import bcrypt

class SignUp(Resource):

    def post(self):
        # parse request body
        parser = reqparse.RequestParser()
        parser.add_argument(name='username', required=True)
        parser.add_argument(name='email', required=True)
        parser.add_argument(name='password', required=True)
        args = parser.parse_args()
        
        # hash password
        salt = bcrypt.gensalt()
        password = bcrypt.hashpw(args['password'].encode(), salt)

        # new user
        user = Users(
            username=args['username'],
            email=args['email'],
            password=password,
        )
        user.save()

        return {'token': createJWT(username=user.username, email=user.email)}