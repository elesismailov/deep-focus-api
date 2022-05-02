from functools import wraps
from flask_restful import abort, reqparse
from models.user import Users
import jwt, os

def authenticate(func):
    @wraps(func)
    def wrapper(*args, **kwargs):

        parser = reqparse.RequestParser()
        parser.add_argument(name='Authorization', location='headers', required=True)
        req_args = parser.parse_args()

        token = get_token(req_args)

        try:
            decoded = jwt.decode(
                token,
                os.environ.get('SECRET'),
                algorithms=["HS256"]
            )
            user = Users.objects(email=decoded['email'])[0]

            return func(*args, **kwargs)

        except:
            abort(400)

    return wrapper

def get_token(header):
    b = header['Authorization']
    t = b.split(' ')[-1]

    return t