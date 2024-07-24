import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/hrLogin';
import { styled } from '@mui/system';

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '90vh',
  marginBottom: '-60px',
  background: 'linear-gradient(to right bottom, rgba(253, 216, 29, 0.7), rgba(255, 153, 13, 0.7), rgba(27, 5, 124, 0.7))',
});

const LoginForm = styled('form')({
  width: '400px',
  margin: '200px',
  padding: '40px',
  borderRadius: '8px',
  background: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'hidden',
});

const FormTitle = styled('h2')({
  marginBottom: '20px',
  color: '#333',
  textAlign: 'center',
});

const FormInput = styled('input')({
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
  fontSize: '16px',
  outline: 'none',
});

const SubmitButton = styled('button')({
  width: '100%',
  padding: '12px',
  borderRadius: '4px',
  border: 'none',
  background: '#1976d2',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const ErrorMessage = styled('p')({
  color: 'red',
  textAlign: 'center',
  marginTop: '10px',
});

const SuccessMessage = styled('p')({
  color: 'green',
  textAlign: 'center',
  marginTop: '10px',
});

const MessageDisplayTime = 1000; 

const Authenticate = () => {
  const dispatch = useDispatch();
  const { loggedIn, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);


  useEffect(() => {
    if (error || loggedIn) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, MessageDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [error, loggedIn]);

  useEffect(() => {
   
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser(username, password));
      if (response) {
        localStorage.setItem('username', response.username); 
        setUsername(response.username);
        window.location.href = '/employee/list'; 
        
      }
    } catch (error) {
      console.error('Login failed:', error);
      
    }
  };

  return (
    <Container>
      <LoginForm onSubmit={handleLogin}>
        <FormTitle>Login</FormTitle>
        <FormInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton type="submit">Login</SubmitButton>
        {showMessage && (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {loggedIn && <SuccessMessage>Login successful!</SuccessMessage>}
          </>
        )}
      </LoginForm>
    </Container>
  );
};

export default Authenticate;



