import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchDesignations } from '../../store/designationList';
import { updateDesignationData } from '../../store/designationEdit';
import { deleteDesignationData } from '../../store/designationDelete';

const DesignationsList = () => {
  const dispatch = useDispatch();
  const designations = useSelector(state => state.designationList.designations);
  const status = useSelector(state => state.designationList.status);
  const error = useSelector(state => state.designationList.error);

  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedRole, setUpdatedRole] = useState('');
  const [updatedTotalLeave, setUpdatedTotalLeave] = useState('');

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDesignations());
  }, [dispatch]);

  const handleUpdateDesignation = (designation) => {
    setSelectedDesignation(designation);
    setUpdatedRole(designation.role);
    setUpdatedTotalLeave(designation.total_leave.toString()); // Convert total_leave to string for TextField
    setIsModalOpen(true);
  };

  const handleSaveChanges = () => {
    if (selectedDesignation) {
      dispatch(
        updateDesignationData({
          designationId: selectedDesignation.id,
          data: {
            role: updatedRole,
            total_leave: parseInt(updatedTotalLeave), // Convert updatedTotalLeave back to integer
          },
        })
      )
        .then(() => {
          dispatch(fetchDesignations());
          handleCloseModal();
        })
        .catch((err) => {
          console.error('Failed to update designation:', err);
        });
    }
  };

  const handleCloseModal = () => {
    setSelectedDesignation(null);
    setIsModalOpen(false);
    setUpdatedRole('');
    setUpdatedTotalLeave('');
  };

  const handleDeleteDesignation = (designationId) => {
    dispatch(deleteDesignationData(designationId))
      .then(() => {
        dispatch(fetchDesignations());
        setDeleteConfirmationOpen(false); // Close the confirmation dialog after successful delete
      })
      .catch((err) => {
        console.error('Failed to delete designation:', err);
      });
  };

  const handleOpenDeleteConfirmation = (designationId) => {
    setSelectedDesignation(designations.find(designation => designation.id === designationId));
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setSelectedDesignation(null);
  };

  const username = localStorage.getItem('username');
  if (!username) {
    return <Typography variant="body1" color="error">Unauthorized Access. Please log in.</Typography>;
  }

  if (status === 'loading') {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (status === 'failed') {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }

  return (
    <Box boxShadow={24} p={3} style={{ borderRadius: 18 }}>
      <Paper elevation={0} style={{ padding: 20 }}>
        <Typography variant="h6" gutterBottom>
          Designations List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Total Leave</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {designations.map((designation) => (
              <TableRow key={designation.id} hover>
                <TableCell align="center">{designation.id}</TableCell>
                <TableCell align="center">{designation.role}</TableCell>
                <TableCell align="center">{designation.total_leave}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleUpdateDesignation(designation)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteConfirmation(designation.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-designation-modal-title"
        aria-describedby="edit-designation-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 8,
          }}
        >
          <Typography variant="h6" id="edit-designation-modal-title" gutterBottom>
            Edit Designation
          </Typography>
          <TextField
            id="edit-role"
            name="role"
            label="Role"
            variant="outlined"
            fullWidth
            value={updatedRole}
            onChange={(e) => setUpdatedRole(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            id="edit-total-leave"
            name="total_leave"
            label="Total Leave"
            variant="outlined"
            fullWidth
            value={updatedTotalLeave}
            onChange={(e) => setUpdatedTotalLeave(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{ mr: 2 }}>
            Save Changes
          </Button>
          <Button variant="contained" onClick={handleCloseModal}>Cancel</Button>
        </Box>
      </Modal>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="delete-designation-dialog-title"
        aria-describedby="delete-designation-dialog-description"
      >
        <DialogTitle id="delete-designation-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete the designation `{selectedDesignation?.role}`?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteDesignation(selectedDesignation?.id)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DesignationsList;
