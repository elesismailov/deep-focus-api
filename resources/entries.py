

from flask_restful import Resource

class Entries(Resource):
    def get(self):
        return {'message': 'this is a entries route!'}
