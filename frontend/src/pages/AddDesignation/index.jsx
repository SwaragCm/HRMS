import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDesignation } from '../../store/designationAdd';
import { FormControl } from '@mui/base/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { fetchDesignations } from '../../store/designationList';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../../store/employeesList';


const AddDesignation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMsg] = useState(null);
  const [designation, setDesignation] = useState({
    role: '',
    total_leave: '',
  });

  // Check if username exists in localStorage
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {       
        navigate('/login'); // Redirect to login page
    } else {
        dispatch(fetchEmployees());
    }
}, [dispatch, navigate]);

  const success = () => {
    setErrorMsg(null);
    dispatch(fetchDesignations());
    navigate('/list/role'); // Navigate to designations list page
  };

  const errorHandle = (error) => {
    setErrorMsg(error.error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addDesignation({ designationData: designation, successCB: success, errorCB: errorHandle }));
    // Clear form fields after submission
    setDesignation({
      role: '',
      total_leave: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDesignation({
      ...designation,
      [name]: value,
    });
  };



  return (
    <div>
      <Modal open={true}>
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            backgroundColor: 'background.paper',
            boxShadow: 100,
            p: 6,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Designation
          </Typography>

          <FormControl onSubmit={handleSubmit}>
            <TextField
              id="role"
              name="role"
              label="Role"
              variant="outlined"
              value={designation.role}
              onChange={handleInputChange}
              style={{ marginBottom: '1rem' }}
            />

            <TextField
              id="total_leave"
              name="total_leave"
              label="Total Leave"
              type="number"
              variant="outlined"
              value={designation.total_leave}
              onChange={handleInputChange}
              style={{ marginBottom: '1rem' }}
            />

            <Button onClick={handleSubmit} variant="contained" type="submit" style={{ marginBottom: '1rem' }}>
              Submit
            </Button>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
};

export default AddDesignation;
