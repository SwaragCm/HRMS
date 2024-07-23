# HRMS (Human Resourse Management System)
- Login credentials:
  
     username: userhr
  
     password : hradmin
 - To register new user- http://127.0.0.1:5000/register
      format={
        "user_name":"usernaame",
        "password":"password"
          }
- flask running port -http://127.0.0.1:5000/
- Install all packages in requirement.txt
      `pip install -requirement.txt`
  
- React runnning port -http://localhost:5173
- To run react
  
       npm istall
       npm run dev
  ### *unittest*
- Create new database for testing purpose and change the database in flask before running the test to avoid accidental of data lose.
- To run test file :
      `python3 test_hrms.py`
- To get coverage
  
      `pip install coverage`
  
      `python3 -m coverage run -m unittest test_hrms.py`
  
      `python3 -m coverage report`
  
      `python3 -m coverage html`
