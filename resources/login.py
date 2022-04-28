
from flask_restful import Resource

class LogIn(Resource):
    def get(self):
        return {'message': 'this is a log-in route!'}
