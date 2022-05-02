
from helpers.auth import authenticate
from flask_restful import Resource

class Entry(Resource):
    method_decorators = [authenticate]

    def get(self, id):
        return {'message': 'this is a entry route!'+ id}
