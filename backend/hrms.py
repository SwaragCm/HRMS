from flask import Flask, request, render_template, redirect, url_for, jsonify, session
import flask
from models import *
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker
from flask_cors import CORS,cross_origin
from sqlalchemy import asc 
from flask_bcrypt import Bcrypt 
import datetime as dt
from sqlalchemy.orm import joinedload

app = flask.Flask(__name__)
app.secret_key = 'qwerty'
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@localhost:5432/hrms"


CORS(app)
now = dt.datetime.now(dt.timezone.utc).isoformat()
        
db.init_app(app)
bcrypt = Bcrypt(app) 

@app.route("/")
def home():
    return "Human Resourse Management System"


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    if db.session.query(Authentication).filter_by(username=username).first():
        return jsonify({'message': 'Username already exists. Please choose a different one.'}), 400

    hashed_password = bcrypt.generate_password_hash (password).decode('utf-8') 

    new_user = Authentication(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully!', 'username': username}), 201


@app.route('/login', methods=['POST'])
def login():
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    user = Authentication.query.filter_by(username=username).first()
    hashed_password = bcrypt.generate_password_hash (password).decode('utf-8') 

    if user:
        is_valid = bcrypt.check_password_hash(user._password, password)
        
        if is_valid:
            session['username'] = username
            return jsonify({'message': 'Login successful!', 'username': username}), 200
        else:
            return jsonify({'message': 'Login failed. Incorrect username or password.'}), 401
    else:
        return jsonify({'message': 'Login failed. User does not exist.'}), 401





@app.route("/add/role", methods=["POST"])
def designation():
    data = request.json 
    if not data or 'role' not in data or 'total_leave' not in data:
        return jsonify({"error": "designation and leave is required"}), 400
    
    role = data['role']
    total_leave = data['total_leave']
    designation = Designation(role=role, total_leave=total_leave)
    db.session.add(designation)
    db.session.commit()
    return jsonify({"message": "Designation added successfully"}), 201


@app.route('/designations', methods=['GET'])
def list_roles():
    designations = db.session.query(Designation).order_by(asc(Designation.id)).all()

    # Construct JSON response
    designation_list = []
    for designation in designations:
        designation_dict = {
            'id': designation.id,
            'role': designation.role,
            'total_leave': designation.total_leave,
           
        }
        designation_list.append(designation_dict) 
    return jsonify(designation_list)

@app.route('/designations/<int:designation_id>', methods=['PUT'])
def update_designation(designation_id):

    data = request.json
    role = data.get('role')
    total_leave = data.get('total_leave')


    designation = db.session.query(Designation).filter_by(id=designation_id).first()

    if designation:
        designation.role = role
        designation.total_leave = total_leave
        db.session.commit()    
        return jsonify({'message': 'Designation updated successfully'})

    return jsonify({'error': 'Designation not found'}), 404



@app.route('/designations/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_designation(id):
    designation = db.session.query(Designation).filter_by(id=id).first()
    
    if not designation:
        return jsonify({'error': 'Designation not found'}), 404

    db.session.delete(designation)
    db.session.commit()

    return jsonify({'message': 'Designation  deleted successfully'}), 200
    




@app.route("/add/employee", methods=["POST"])
def employee():
    data = request.json 
    if not data or 'first_name' not in data or 'last_name' not in data or 'email' not in data or 'phone_number' not in data or 'address' not in data or 'designation_id' not in data :
        return jsonify({"error": "employee details is required"}), 400
    
    employee_data = Employee(
    first_name = data['first_name'],
    last_name = data['last_name'],
    email = data['email'],
    phone_number=data['phone_number'],
    address=data['address'],
    designation_id=data['designation_id']
    )
    
    db.session.add(employee_data)
    db.session.commit()
    return jsonify({"message": "employee added successfully"}), 201





@app.route('/employees', methods=['GET'])
def employee_list():    
    select_query = db.session.query(
        Employee.id,
        Employee.first_name,
        Employee.last_name,
        Employee.address,
        Employee.phone_number,
        Employee.email,            
        Designation.role,
        Designation.total_leave,
        Leave.leave_taken
    ).filter(
        Employee.deleted_at == None  # Filter where deleted_at is NULL
    ).outerjoin(
        Designation, Employee.designation_id == Designation.id
    ).outerjoin(
        Leave, Employee.id == Leave.employee_id
    ).order_by(Employee.id)  # Example: order by Employee ID
    employee_data = db.session.execute(select_query).fetchall()
    emp_data = []
    for emp in employee_data:
        emp_data.append({
            "id": emp.id,
            "first_name": emp.first_name,
            "last_name": emp.last_name,
            "phone_number": emp.phone_number,
            "email": emp.email,
            "address": emp.address,
            "designation_name": emp.role,
            "leave_taken": emp.leave_taken,
            "total_leave": emp.total_leave
        })
    return flask.jsonify({"data": emp_data})




@app.route('/employees/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    data = request.get_json()
   
    employee = db.session.query(Employee).filter_by(id=employee_id).first()
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    if 'first_name' in data:
        employee.first_name = data['first_name']
    if 'last_name' in data:
        employee.last_name = data['last_name']
    if 'email' in data:
        employee.email = data['email']
    if 'phone_number' in data:
        employee.phone_number = data['phone_number']
    if 'address' in data:
        employee.address = data['address']
    if 'designation_id' in data:
        employee.designation_id = data['designation_id']
    if 'designation_name' in data:
        designation = db.session.query(Designation).filter_by(role=data['designation_name']).first()
        if designation:
            employee.designation = designation
        else:
            return jsonify({'error': f'Designation with role "{data["designation_name"]}" not found'}), 404
        
    if 'leave_taken' in data:
        leave_taken_value = int(data['leave_taken']) if data['leave_taken'] != '0' else 0

        if leave_taken_value > designation.total_leave:
            return jsonify({'error': 'Leave taken cannot exceed total leave'}), 400
        
        leaves = db.session.query(Leave).filter_by(employee_id=employee.id).first()
        if leaves:
            leaves.leave_taken = leave_taken_value
        else:
            new_leave = Leave(employee_id=employee.id, leave_taken=leave_taken_value)
            db.session.add(new_leave)

    db.session.commit()

    return jsonify({'message': 'Employee updated successfully'}), 200




@app.route('/employees/<int:id>', methods=['POST'])
def delete_employee(id):
        now = dt.datetime.now(dt.timezone.utc).isoformat()
        employee = db.session.query(Employee).get(id)
        employee.deleted_at = now
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        db.session.commit()
        return jsonify({'message': 'Employee deleted successfully'}), 200



@app.route("/add/leave", methods=["POST"])
def leave():
    data = request.json
    if not data or 'leave_taken' not in data or 'leave_taken' not in data:
        return jsonify({"error": "leave status is required"}), 400    
    leave_taken = data['leave_taken']
    employee_id = data['employee_id']
    leave = Leave(employee_id=employee_id, leave_taken=leave_taken)
    db.session.add(leave)
    db.session.commit()
    return jsonify({"message": "Leave status added successfully"}), 201

@app.route('/leave/taken', methods =["GET"])
def leave_records():
    
    leave_data = db.session.query(Leave).all()

    leave_list = []
    for leave in leave_data:
        employee_name = f"{leave.employees.first_name} {leave.employees.last_name}"
        leave_list.append({
            'id': leave.id,
            'leave_taken': leave.leave_taken,
            'employee_id': leave.employee_id,
            'employee_name': leave.employees.employee_name 
        })

    return jsonify(leave_list)




@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)  
    return jsonify({'message': 'Logged out successfully.'}), 200




with app.app_context():
   db.create_all()

if __name__ == "__main__":
  init_db()
  app.run(port=5000)