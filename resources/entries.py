
from flask_restful import Resource
from helpers.auth import authenticate

class Entries(Resource):
    method_decorators = [authenticate]

    def get(self):
        return {'message': 'this is a entries route!'}
