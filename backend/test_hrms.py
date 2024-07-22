import unittest
from hrms import app, db,bcrypt, Designation
from models import Designation, Employee, Authentication, Leave
from flask import json,session,request
from flask_bcrypt import Bcrypt



class DesignationAddTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_add_designation_success(self):
        data = {
            'role': 'Engineer',
            'total_leave': 20
        }
        response = self.app.post('/add/role', json=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.data), {"message": "Designation added successfully"})

        designation = Designation(role='Engineer', total_leave=20)
        self.assertIsNotNone(designation)
        self.assertEqual(designation.total_leave, 20)

   
    def test_missing_fields(self):
        data = {
            'role': 'Manager'
        }
        response = self.app.post('/add/role', json=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"designation and leave is required", response.data)




class DesignationsListTestCase(unittest.TestCase):

    def setUp(self):
        """Set up the test app"""
        app.config['TESTING'] = True
        self.app = app
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_list_designations(self):
        designation1 = Designation(role='Engineer', total_leave=20)
        designation2 = Designation(role='Manager', total_leave=25)
        db.session.add(designation1)
        db.session.add(designation2)
        db.session.commit()

        response = self.app.get('/designations')
        self.assertEqual(response.status_code, 200)

        designation_list = json.loads(response.data)

        self.assertEqual(len(designation_list), 2) 
        self.assertEqual(designation_list[0]['role'], 'Engineer')
        self.assertEqual(designation_list[1]['role'], 'Manager')

    def test_list_designations_empty(self):
        response = self.app.get('/designations')
        self.assertEqual(response.status_code, 200)

        designation_list = json.loads(response.data)
        self.assertEqual(designation_list, [])


class UpdateDesignationTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app
        self.client= app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_update_designation_success(self):
        designation = Designation(id = 1, role='Engineer', total_leave=20)
        db.session.add(designation)
        db.session.commit()

        updated_data = {
            'role': 'Senior Engineer',
            'total_leave': 25
        }
        response = self.client.put(f'/designations/{designation.id}', json=updated_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data), {'message': 'Designation updated successfully'})

       
        self.assertEqual(designation.role, 'Senior Engineer')
        self.assertEqual(designation.total_leave, 25)

    def test_update_designation_not_found(self):
        non_existent_id = 999  

        updated_data = {
            'role': 'Senior Engineer',
            'total_leave': 25
        }
        response = self.client.put(f'/designations/{non_existent_id}', json=updated_data)
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'Designation not found', response.data)


class DeleteDesignationTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app
        self.client= app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_delete_designation_success(self):
        designation = Designation(role='Engineer', total_leave=20)
        db.session.add(designation)
        db.session.commit()

        response = self.client.delete(f'/designations/{designation.id}')
        response_data = response.get_json()
        self.assertEqual(response_data['message'], 'Designation deleted successfully')

    def test_delete_designation_not_found(self):
        
        non_existent_id = 999 

        response = self.client.delete(f'/designations/{non_existent_id}')
        response_data = response.get_json()
        self.assertEqual(response_data['error'], 'Designation not found')





class EmployeeAddTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app
        self.client= app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_add_employee_success(self):
        designation = Designation(id =1, role='Engineer', total_leave=20)
        designation_id = designation.id
        db.session.add(designation)
        db.session.commit()
        employee_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'phone_number': '1234567890',
            'address': '123 Main St, Anytown, USA',
            'designation_id': designation_id  
        }

        response = self.client.post('/add/employee', json=employee_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.data), {'message': 'employee added successfully'})

       

    def test_add_employee_missing_data(self):
        employee_data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane.smith@example.com',
            'phone_number': '9876543210',
            'address': '456 Elm St, Anytown, USA'
               }

        response = self.client.post('/add/employee', json=employee_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'employee details is required', response.data)

        
class EmployeeListTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_employee_list_with_data(self):
        designation = Designation(role='Engineer', total_leave=20)
        employee1 = Employee(
            first_name='John',
            last_name='Doe',
            email='john.doe@example.com',
            phone_number='1234567890',
            address='123 Main St, Anytown, USA',
            designation=designation,
        )
        leave = Leave(employee_id=1, leave_taken=5)

        db.session.add_all([designation, employee1,leave])
        db.session.commit()

        response = self.app.get('/employees')
        self.assertEqual(response.status_code, 200)

        employee_list = json.loads(response.data)['data']

        self.assertEqual(len(employee_list), 1)  
        self.assertEqual(employee_list[0]['first_name'], 'John')
        self.assertEqual(employee_list[0]['last_name'], 'Doe')
        self.assertEqual(employee_list[0]['phone_number'], '1234567890')
        self.assertEqual(employee_list[0]['email'], 'john.doe@example.com')
        self.assertEqual(employee_list[0]['address'], '123 Main St, Anytown, USA')
        self.assertEqual(employee_list[0]['designation_name'], 'Engineer')
        self.assertEqual(employee_list[0]['leave_taken'], 5)
        self.assertEqual(employee_list[0]['total_leave'], 20)

    def test_employee_list_empty(self):
        response = self.app.get('/employees')
        self.assertEqual(response.status_code, 200)

        employee_list = json.loads(response.data)['data']

        self.assertEqual(employee_list, [])



class DeleteEmployeeTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_delete_employee_success(self):
        designation = Designation(role='Engineer', total_leave=20)
        employee = Employee(
            first_name='John',
            last_name='Doe',
            email='john.doe@example.com',
            phone_number='1234567890',
            address='123 Main St, Anytown, USA',
            designation=designation
        )
        db.session.add(employee,designation)
        db.session.commit()

        response = self.app.post(f'/employees/{employee.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data), {'message': 'Employee deleted successfully'})



class AddLeaveTestCase(unittest.TestCase):

    def setUp(self):
        """Set up the test app"""
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        """Tear down the test app"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_add_leave_success(self):
        """Test adding leave status for an employee"""

        designation = Designation(role='Engineer', total_leave=20)
        employee = Employee(
            first_name='John',
            last_name='Doe',
            email='john.doe@example.com',
            phone_number='1234567890',
            address='123 Main St, Anytown, USA',
            designation=designation
        )
        db.session.add(employee,designation)
        db.session.commit()
        leave_data = {
            'leave_taken': 5,
            'employee_id': 1
        }

        response = self.app.post('/add/leave', json=leave_data)
        self.assertEqual(response.status_code, 201)

        self.assertEqual(json.loads(response.data), {'message': 'Leave status added successfully'})


    def test_add_leave_missing_data(self):
        response = self.app.post('/add/leave', json={})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.data), {'error': 'leave status is required'})


class LeaveRecordsTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    

    def test_leave_records(self):
        designation = Designation(role='Engineer', total_leave=20)
        employee1 = Employee(
            first_name='John',
            last_name='Doe',
            email='john.doe@example.com',
            phone_number='1234567890',
            address='123 Main St, Anytown, USA',
            designation=designation,
        )
        leave = Leave(employee_id=1, leave_taken=5)

        db.session.add_all([designation, employee1,leave])
        db.session.commit()

        response = self.app.get('/leave/taken')
        self.assertEqual(response.status_code, 200)


class LogoutTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_logout_success(self):
        with self.app as client:
            with client.session_transaction() as sess:
                sess['username'] = 'test_user'

        response = self.app.post('/logout')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(json.loads(response.data), {'message': 'Logged out successfully.'})

        with self.app as client:
            with client.session_transaction() as sess:
                self.assertNotIn('username', sess)




class LoginTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()
  


        hashed_password = bcrypt.generate_password_hash('password').decode('utf-8')
        self.test_user = Authentication(username='test_user', password=hashed_password)
        db.session.add(self.test_user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_login_success(self):
        login_data = {
            'username': 'test_user',
            'password': 'password'
        }

        response = self.app.post('/login', json=login_data)
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], 'Login successful!')

    def test_login_missing_credentials(self):
        response = self.app.post('/login', json={})
        self.assertEqual(response.status_code, 400)

        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], 'Username and password are required.')

    def test_login_invalid_credentials(self):
        invalid_login_data = {
            'username': 'test_user',
            'password': 'wrong_password'
        }

        response = self.app.post('/login', json=invalid_login_data)
        self.assertEqual(response.status_code, 401)

        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], 'Login failed. Incorrect username or password.')

    def test_login_nonexistent_user(self):
        nonexistent_login_data = {
            'username': 'nonexistent_user',
            'password': 'password'
        }

        response = self.app.post('/login', json=nonexistent_login_data)
        self.assertEqual(response.status_code, 401)

        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], 'Login failed. User does not exist.')


class RegisterTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register_success(self):
        register_data = {
            'username': 'test_user',
            'password': 'password'
        }

        response = self.app.post('/register', json=register_data)
        self.assertEqual(response.status_code, 201)

        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], 'User registered successfully!')

    def test_register_missing_credentials(self):
        response = self.app.post('/register', json={})
        self.assertEqual(response.status_code, 400)

        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], 'Username and password are required.')


class UpdateEmployeeTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    
    def test_update_employee_success(self):
        designation = Designation(id = 1, role='Engineer', total_leave=20)
        designation_id = designation.id
        db.session.add(designation)
        db.session.commit()
        employee1 = Employee(
            first_name='John',
            last_name='Doe',
            email='john.doe@example.com',
            phone_number='1234567890',
            address='123 Main St, Anytown, USA',
            designation_id= designation_id ,
        )
        db.session.add(employee1)
        db.session.commit()

        leave = Leave(employee_id=employee1.id, leave_taken=5)
        db.session.add(leave)
        db.session.commit()

        updated_data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane.smith@example.com',
            'phone_number': '9876543210',
            'address': '456 Elm St',
            'designation_id': designation.id,
            'designation_name':designation.role,
            'leave_taken': 10
        }
        response = self.app.put(f'/employees/{employee1.id}', json=updated_data)
        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], 'Employee updated successfully')


    def test_update_employee_not_found(self):
        updated_data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane.smith@example.com',
            'phone_number': '9876543210',
            'address': '456 Elm St',
            'designation_id': 1,
            'leave_taken': 10
        }
        response = self.app.put('/employees/999', json=updated_data)
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.data)
        self.assertEqual(response_data['error'], 'Employee not found')

    def test_update_employee_invalid_designation(self):

        designation = Designation(id = 1, role='Engineer', total_leave=20)
        designation_id = designation.id
        db.session.add(designation)
        db.session.commit()
        employee1 = Employee(
            first_name='John',
            last_name='Doe',
            email='john.doe@example.com',
            phone_number='1234567890',
            address='123 Main St, Anytown, USA',
            designation_id= 1 ,
        )
        db.session.add(employee1)
        db.session.commit()
        
        updated_data = {
            'designation_name': 'Non-existent Role'
        }
        response = self.app.put(f'/employees/{employee1.id}', json=updated_data)
        self.assertEqual(response.status_code, 404)

        response_data = json.loads(response.data)
        self.assertIn('Designation with role', response_data['error'])

    def test_update_employee_exceed_leave(self):
        designation = Designation(id = 1, role='Engineer', total_leave=20)
        designation_id = designation.id
        db.session.add(designation)
        db.session.commit()
        employee1 = Employee(
            first_name='John',
            last_name='Doe',
            email='john.doe@example.com',
            phone_number='1234567890',
            address='123 Main St, Anytown, USA',
            designation_id= designation_id ,
        )
        db.session.add(employee1)
        db.session.commit()

        leave = Leave(employee_id=employee1.id, leave_taken=5)
        db.session.add(leave)
        db.session.commit()

        updated_data = {
            'designation_name':designation.role,
            'leave_taken': 25  
        }
        response = self.app.put(f'/employees/{employee1.id}', json=updated_data)
        self.assertEqual(response.status_code, 400)


        response_data = json.loads(response.data)
        self.assertEqual(response_data['error'], 'Leave taken cannot exceed total leave')



if __name__ == '__main__':
    unittest.main()



