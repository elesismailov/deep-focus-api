from flask import Flask
from flask_restful import Resource, Api

from resources.login import LogIn
from resources.signup import SignUp
from resources.entries import Entries
from resources.entry import Entry

app = Flask(__name__)
api = Api(app)

# api.add_resource(HelloWorld, '/')

api.add_resource(LogIn, '/log-in')
api.add_resource(SignUp, '/sign-up')
api.add_resource(Entries, '/entries')
api.add_resource(Entry, '/entry/<int:id>')

if __name__ == '__main__':
    app.run(debug=True)
