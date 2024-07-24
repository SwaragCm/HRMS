import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee } from '../../store/employeeAdd';
import { fetchDesignations } from '../../store/designationList';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../../store/employeesList';

const AddEmployee = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMsg] = useState(null);
    const [employee, setEmployee] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        designation_id: '', 
    });

    const designations = useSelector(state => state.designationList.designations);
    

   
    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {            
            navigate('/login');
        } else {
            dispatch(fetchDesignations());
        }
    }, [dispatch, navigate]);

    const success = () => {
        setErrorMsg(null);
        dispatch(fetchEmployees());
        navigate('/employee/list');
    };

    const errorHandle = (error) => {
        setErrorMsg(error.error);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createEmployee({ employeeData: employee, successCB: success, errorCB: errorHandle }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmployee({
            ...employee,
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
                        Add New Employee
                    </Typography>

                    <FormControl onSubmit={handleSubmit}>
                        <TextField
                            id="first_name"
                            name="first_name"
                            label="First Name"
                            variant="outlined"
                            value={employee.first_name}
                            onChange={handleInputChange}
                            style={{ marginBottom: '1rem' }}
                        />

                        <TextField
                            id="last_name"
                            name="last_name"
                            label="Last Name"
                            variant="outlined"
                            value={employee.last_name}
                            onChange={handleInputChange}
                            style={{ marginBottom: '1rem' }}
                        />

                        <TextField
                            id="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            value={employee.email}
                            onChange={handleInputChange}
                            style={{ marginBottom: '1rem' }}
                        />

                        <TextField
                            id="phone_number"
                            name="phone_number"
                            label="Phone Number"
                            variant="outlined"
                            value={employee.phone_number}
                            onChange={handleInputChange}
                            style={{ marginBottom: '1rem' }}
                        />

                        <TextField
                            id="address"
                            name="address"
                            label="Address"
                            variant="outlined"
                            value={employee.address}
                            onChange={handleInputChange}
                            style={{ marginBottom: '1rem' }}
                        />

                        <FormControl variant="outlined" style={{ marginBottom: '1rem', minWidth: 200 }}>
                            <InputLabel id="designation-label">Designation</InputLabel>
                            <Select
                                labelId="designation-label"
                                id="designation"
                                name="designation_id"
                                value={employee.designation_id}
                                onChange={handleInputChange}
                                label="Designation"
                            >
                                <MenuItem value="">Select Designation</MenuItem>
                                {designations.map((designation) => (
                                    <MenuItem key={designation.id} value={designation.id}>
                                        {designation.role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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

export default AddEmployee;



