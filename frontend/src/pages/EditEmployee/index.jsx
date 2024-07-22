import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { fetchEmployees } from '../../store/employeesList';
import { updateEmployeeData } from '../../store/employeeUpdate'; 

const EditEmployee = ({ isOpen, onClose, employee, designations }) => {
  const dispatch = useDispatch();

  const [updatedEmployee, setUpdatedEmployee] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    designation_name: '',
    leave_taken: '',
  });

  const [leaveError, setLeaveError] = useState('');

  useEffect(() => {
    if (employee) {
      setUpdatedEmployee({
        id: employee.id,
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone_number: employee.phone_number || '',
        address: employee.address || '',
        designation_name: employee.designation_name || '',
        leave_taken: employee.leave_taken || '0',
      });
    }
  }, [employee]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));

    // Validate leave_taken against total_leave
    if (name === 'leave_taken') {
      const totalLeave = employee.total_leave;
      if (parseInt(value) > parseInt(totalLeave)) {
        setLeaveError('Leave taken cannot exceed total leave.');
      } else {
        setLeaveError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id } = updatedEmployee;
    dispatch(updateEmployeeData({ employeeId: id, data: updatedEmployee }))
      .then(() => {
        dispatch(fetchEmployees());
        onClose();
      })
      .catch((err) => {
        console.error('Failed to update employee:', err);
      });
  };

  if (!isOpen) {
    return null; // Render nothing if isOpen is false
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          backgroundColor: 'background.paper',
          boxShadow: 24,
          p: 4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Employee Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            id="first_name"
            name="first_name"
            label="First Name"
            variant="outlined"
            fullWidth
            value={updatedEmployee.first_name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            id="last_name"
            name="last_name"
            label="Last Name"
            variant="outlined"
            fullWidth
            value={updatedEmployee.last_name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={updatedEmployee.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            id="phone_number"
            name="phone_number"
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={updatedEmployee.phone_number}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            id="address"
            name="address"
            label="Address"
            variant="outlined"
            fullWidth
            value={updatedEmployee.address}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            id="designation_name"
            name="designation_name"
            label="Designation"
            variant="outlined"
            fullWidth
            value={updatedEmployee.designation_name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          >
            {designations.map((designation) => (
              <MenuItem key={designation.id} value={designation.role}>
                {designation.role}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="leave_taken"
            name="leave_taken"
            label="Leave Taken"
            variant="outlined"
            fullWidth
            value={updatedEmployee.leave_taken}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            error={!!leaveError}
            helperText={leaveError}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Update Employee
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

EditEmployee.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object,
  designations: PropTypes.array.isRequired,
};

export default EditEmployee;

