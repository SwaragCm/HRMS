import authReducer from './hrLogin'; // Import your reducer slice
import { configureStore } from '@reduxjs/toolkit';
import employeeAddReducer from './employeeAdd';
import employeeListReducer from './employeesList';
import designationsReducer from './designationAdd';
import designationListReducer from './designationList'; 
import employeeUpdateReducer from './employeeUpdate';
import logoutReducer from './hrLogout';
import designationEditReducer from './designationEdit';
import employeeDeleteReducer from './employeeDelete';
import designationDeleteReducer from './designationDelete';

export const store = configureStore({
    reducer: {
      auth:authReducer,
      employeeAdd: employeeAddReducer,
      employeeList: employeeListReducer,
      designations: designationsReducer,
      designationList: designationListReducer,
      employeeUpdate: employeeUpdateReducer,
      logout: logoutReducer,
      designationEdit: designationEditReducer,
      employeeDelete: employeeDeleteReducer,
      designationDelete: designationDeleteReducer,
    },
  })


