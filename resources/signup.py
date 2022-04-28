

from flask_restful import Resource

class SignUp(Resource):
    def get(self):
        return {'message': 'this is a sign-up route!'}
