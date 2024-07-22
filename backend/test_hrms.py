import unittest
from hrms import app, db,bcrypt
from models import Designation, Employee, Authentication, Leave
from flask import json,session
from flask_bcrypt import Bcrypt

# class TestLogin(unittest.TestCase):

#     def setUp(self):
#         self.app = app.test_client()
#         self.app.testing = True


#     def test_login_missing_credentials(self):
#         payload = json.dumps({})
#         response = self.app.post('/login', headers={"Content-Type": "application/json"}, data=payload)
#         self.assertEqual(response.status_code, 400)
#         self.assertIn('Username and password are required.', response.json['error'])

#     def test_login_successful(self):
#         payload = json.dumps({
#             'username': 'sampleuser',  # Replace with a valid username in your test database
#             'password': 'user123'   # Replace with the corresponding valid password
#         })
#         response = self.app.post('/login', headers={"Content-Type": "application/json"}, data=payload)
#         self.assertEqual(response.status_code, 200)
#         self.assertIn('Login successful!', response.json['message'])

   






class TestDesignationEndpoint(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/hrms_sample_test'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

        db.create_all()

        # Test designation
        self.test_designation = Designation(role='Engineer', total_leave=20)
        db.session.add(self.test_designation)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_add_designation_success(self):
        # Test case for successful addition of designation
        data = {
            'role': 'Manager',
            'total_leave': 15
        }
        response = self.app.post('/add/role', json=data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('Designation added successfully', response.json['message'])

    def test_missing_role_field(self):
        # Test case for missing 'role' field in request
        data = {
            'total_leave': 15
        }
        response = self.app.post('/add/role', json=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('designation and leave is required', response.json['error'])

    def test_missing_total_leave_field(self):
        # Test case for missing 'total_leave' field in request
        data = {
            'role': 'Developer'
        }
        response = self.app.post('/add/role', json=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('designation and leave is required', response.json['error'])





# with app.app_context():
#    db.create_all()

if __name__ == '__main__':
    unittest.main()



