import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';

const Navbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setExpanded(false);
    navigate('/login');
  };

  const closeNavbar = () => setExpanded(false);

  return (
    <BsNavbar 
      bg="light" 
      expand="lg" 
      expanded={expanded}
      className="border-bottom"
    >
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="fw-bold">
          Event Management
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : true)}
        />
        
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/events" onClick={closeNavbar}>
              Events
            </Nav.Link>
            
            {isAuthenticated && userRole === 'admin' && (
              <Nav.Link as={Link} to="/admin/events" onClick={closeNavbar}>
                Manage Events
              </Nav.Link>
            )}
            
            {isAuthenticated && (
              <Nav.Link as={Link} to="/user/bookings" onClick={closeNavbar}>
                My Bookings
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <Button 
                variant="outline-dark" 
                onClick={handleLogout}
                className="ms-2"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-dark" 
                  className="me-2"
                  onClick={closeNavbar}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="dark"
                  onClick={closeNavbar}
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
