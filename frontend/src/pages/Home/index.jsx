import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Navbar from '../Components/Navbar';
import Typography from '@mui/material/Typography';

const theme = createTheme();

const HomeContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  minHeight: '100vh', 
  overflow: 'hidden', 
});

const ImageCarousel = styled('div')({
  maxWidth: '860px',
  textAlign: 'center',
  margin: '0 auto',
  padding: '0 20px',
  width: '110%',
});

const LogoImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  marginBottom: '20px',
});

const Quote = styled('blockquote')({
  fontStyle: 'italic',
  fontSize: '1.2rem',
  lineHeight: '1.6',
  color: '#555',
  marginTop: '20px',
});

const Footer = styled('footer')({
  marginTop: 'auto', 
  padding: '10px',
  background: '#f0f0f0',
  width: '100%',
  textAlign: 'center',
  position: 'fixed', 
  bottom: 0, 
});

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <HomeContainer>
        <Navbar />
        <ImageCarousel>
          <LogoImage src="/Logo_with_white_Background.png" alt="Logo" />
          <Typography variant="h1" component="h1" gutterBottom style={{fontSize:'4rem'}}>
            HRMS SOFTWARE
          </Typography>
          <Quote>
            <Typography variant="body1" component="p" gutterBottom>
              Welcome to our cutting-edge Human Resource Management System! Our platform is
              tailored to streamline your HR processes effortlessly.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              From seamless employee onboarding to intuitive performance tracking, we have got it
              all covered. Experience a robust, user-friendly interface that empowers you to
              manage your workforce efficiently.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Explore advanced features like attendance tracking, leave management, and
              comprehensive reporting to elevate your HR operations.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Revolutionize your HR department with our powerful and customizable solution.
              Get started today for a smarter, more efficient HR management experience.
            </Typography>
          </Quote>
        </ImageCarousel>
        <Footer>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </Typography>
        </Footer>
      </HomeContainer>
    </ThemeProvider>
  );
};

export default Home;



