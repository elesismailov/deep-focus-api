
from flask import request
from flask_restful import Resource, reqparse
from helpers.auth import authenticate

class Entries(Resource):
    method_decorators = [authenticate]

    def get(self):
        return {'message': 'this is a entries route!'}

    # create new entry
    # the kwargs are set from the auth decorator, so we can access them here
    def post(self, **kwargs):
        user = kwargs['user']

        req_json = request.get_json(force=True)

        user.entries.append([
            req_json['startTime'],
            req_json['endTime']
        ])
        print(user.entries)
        user.save()
