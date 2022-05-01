

from flask_restful import Resource, reqparse
from models.user import Users
from helpers.jwt import createJWT

def bcrypt(p):
    return p

class SignUp(Resource):
    # def get(self):
    #     return {'message': 'this is a sign-up route!'}

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='username', required=True)
        parser.add_argument(name='email', required=True)
        parser.add_argument(name='password', required=True)
        args = parser.parse_args()

        # new user
        user = Users(
            username=args['username'],
            email=args['email'],
            password=bcrypt(args['password'])
        )
        user.save()

        return {'token': createJWT(username=user.username, email=user.email)}