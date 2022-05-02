
from flask_restful import Resource, reqparse
from models.user import Users
from helpers.jwt import createJWT
import bcrypt

class LogIn(Resource):

    def post(self):

        parser = reqparse.RequestParser()
        parser.add_argument(name='email', required=True)
        parser.add_argument(name='password', required=True)
        args = parser.parse_args()

        # user exists?
        try:
            user = Users.objects(email=args['email'])[0]
        except:
            return 

        if bcrypt.checkpw(args['password'].encode(), user.password.encode()):
            # signed in
            return {'token': createJWT(username=user.username, email=user.email)}

        return 