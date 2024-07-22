import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tooltip,
} from '@mui/material';
import QRCodeDisplay from '../Vcard';
import EmployeeEditModal from '../EditEmployee';
import EditIcon from '@mui/icons-material/Edit';
import VCardIcon from '@mui/icons-material/AssignmentInd';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchEmployees } from '../../store/employeesList';
import { fetchDesignations } from '../../store/designationList';
import { deleteEmployeeData } from '../../store/employeeDelete';


const EmployeeList = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employeeList.employees);
  const status = useSelector((state) => state.employeeList.status);
  const error = useSelector((state) => state.employeeList.error);
  const designations = useSelector((state) => state.designationList.designations);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [username, setUsername] = useState(() => localStorage.getItem('username'))



  useEffect(() => {
    if (status === 'idle') {
      
      dispatch(fetchEmployees());
      dispatch(fetchDesignations());
    }
    setUsername(localStorage.getItem('username'));
  }, [dispatch, status]);


  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true); 
  };

  const handleViewQRCode = (employee) => {
    setSelectedEmployee(employee);
    setIsQRModalOpen(true);
  };

  const handleCloseQRCode = () => {
    setIsQRModalOpen(false);
  };

  const handleDeleteEmployee = (employeeId) => {
    dispatch(deleteEmployeeData(employeeId))
      .then(() => {
        dispatch(fetchEmployees());
        setDeleteDialogOpen(false);
      })
      .catch((err) => {
        console.error('Failed to delete employee:', err);
      });
  };

  const handleOpenDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleRowHover = (employee) => {
    setHoveredRow(employee.id);
  };

  const handleRowHoverExit = () => {
    setHoveredRow(null);
  };

  if (status === 'loading') {
    return (
      <Typography variant="body1">
        <CircularProgress />
        Loading...
      </Typography>
    );
  }

  if (status === 'failed') {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }

  if (!username) {
    return <Typography variant="body1" color="error">Unauthorized Access. Please log in.</Typography>;
  }

  return (
    <Box boxShadow={24} p={3} style={{ borderRadius: 18 }}>
      <div>
        <Paper elevation={0} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ padding: 2 }}>
            Employees List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Emp.ID</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone Number</TableCell>
                  <TableCell align="center">Address</TableCell>
                  <TableCell align="center">Designation</TableCell>
                  <TableCell align="center">Leave Taken</TableCell>
                  <TableCell align="center">Total Leave</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    onMouseEnter={() => handleRowHover(employee)}
                    onMouseLeave={handleRowHoverExit}
                    style={{
                      backgroundColor: hoveredRow === employee.id ? '#f5f5f5' : 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    <TableCell align="center">{employee.id}</TableCell>
                    <TableCell align="center">{employee.first_name} {employee.last_name}</TableCell>
                    <TableCell align="center">{employee.email}</TableCell>
                    <TableCell align="center">{employee.phone_number}</TableCell>
                    <TableCell align="center">{employee.address}</TableCell>
                    <TableCell align="center">{employee.designation_name}</TableCell>
                    <TableCell align="center">{employee.leave_taken}</TableCell>
                    <TableCell align="center">{employee.total_leave}</TableCell>
                    <TableCell align="center">
                      <div>
                        <Tooltip title="Edit">
                          <EditIcon
                            color="primary"
                            onClick={() => handleViewDetails(employee)}
                            style={{ cursor: 'pointer', marginRight: 8 }}
                          />
                        </Tooltip>
                        <Tooltip title="Vcard">
                          <VCardIcon
                            color="primary"
                            onClick={() => handleViewQRCode(employee)}
                            style={{ cursor: 'pointer', marginRight: 8 }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <DeleteIcon
                            color="error"
                            onClick={() => handleOpenDeleteDialog(employee)}
                            style={{ cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={isQRModalOpen} onClose={handleCloseQRCode} aria-labelledby="qr-code-dialog-title">
            <DialogTitle id="qr-code-dialog-title">QR Code</DialogTitle>
            <DialogContent>
              <QRCodeDisplay isOpen={true} onClose={handleCloseQRCode} employee={selectedEmployee} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseQRCode} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Delete Employee</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete this employee?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleDeleteEmployee(selectedEmployee.id)} variant="contained" color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <EmployeeEditModal
            isOpen={editModalOpen}
            onClose={handleCloseEditModal}
            employee={selectedEmployee}
            designations={designations}
          />
        </Paper>
      </div>
    </Box>
  );
};

export default EmployeeList;






