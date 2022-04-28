

from flask_restful import Resource

class Entry(Resource):
    def get(self, id):
        return {'message': 'this is a entry route!'+ id}
