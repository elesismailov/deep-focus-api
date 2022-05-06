
from flask import request
from flask_restful import Resource, reqparse
from helpers.auth import authenticate

class Entries(Resource):
    method_decorators = [authenticate]

    def get(self):
        return {'message': 'this is a entries route!'}

    # create new entry
    def post(self):
        print('post entries')

        json = request.get_json(force=True)

        print(json)

        return {'hello': 'there'}