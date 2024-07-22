import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authenticate from './pages/Authenticate';
import Home from './pages/Home';
import AddEmployee from './pages/AddEmployee';
import EmployeesList from './pages/EmployeesList';
import AddDesignation from './pages/AddDesignation';
import DesignationsList from './pages/DesignationsList';
import Navbar from './pages/Components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Authenticate />} />
        <Route path='/employee/add' element={<AddEmployee />} />
        <Route path='/employee/list' element={<EmployeesList />} />
        <Route path='/add/designation' element={<AddDesignation />} />
        <Route path='/list/role' element={<DesignationsList />} />
      </Routes>
    </Router>
  );
}

export default App;



