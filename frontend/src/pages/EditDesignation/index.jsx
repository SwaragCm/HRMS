import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { updateDesignationData } from '../../store/designationEdit';
import { fetchDesignations } from '../../store/designationList';

const EditDesignation = ({ id }) => {
  const dispatch = useDispatch();
  const designations = useSelector(state => state.designationList.designations);

  const [updatedDesignation, setUpdatedDesignation] = useState({
    role: '',
    total_leave: 0,
  });

  useEffect(() => {
    const designation = designations.find(d => d.id === id);
    if (designation) {
      setUpdatedDesignation({
        role: designation.role || '',
        total_leave: designation.total_leave || 0,
      });
    }
  }, [id, designations]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedDesignation(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { role, total_leave } = updatedDesignation;
    dispatch(updateDesignationData({ designationId: id, data: { role, total_leave } }))
      .then(() => {
        dispatch(fetchDesignations())
        
      })
      .catch((err) => {
        console.error('Failed to update designation:', err);
      });
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Edit Designation
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="role"
          name="role"
          label="Role"
          variant="outlined"
          fullWidth
          value={updatedDesignation.role}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          id="total_leave"
          name="total_leave"
          label="Total Leave"
          variant="outlined"
          fullWidth
          value={updatedDesignation.total_leave}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

// PropTypes validation
EditDesignation.propTypes = {
  id: PropTypes.number.isRequired, 
};

export default EditDesignation;
