import { useState, useEffect } from 'react';
import { Card, Container, Button, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents } from '../../services/eventService';
import { getMyBookings } from '../../services/bookingService';
import { toast } from 'react-toastify';
import BookingForm from '../../components/BookingForm';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch events
        const eventsData = await getEvents();
        setEvents(eventsData.data || []);
        
      
        if (isAuthenticated) {
          try {
            const bookingsData = await getMyBookings();
            setMyBookings(bookingsData.data || []);
          } catch (err) {
            console.error('Error fetching user bookings:', err);
          }
        }
        
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
        setLoadingBookings(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);  

  const handleBookNow = (event) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events` } });
      return;
    }
    
    
    if (hasBookedEvent(event._id)) {
      toast.info('You have already booked this event');
      return;
    }
    
    setSelectedEvent(event);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = async () => {
    try {

      toast.success('Event booked successfully!');
      

      const [eventsData, bookingsData] = await Promise.all([
        getEvents(),
        isAuthenticated ? getMyBookings() : Promise.resolve({ data: [] })
      ]);
      
      setEvents(eventsData.data || []);
      
      if (isAuthenticated) {
        setMyBookings(bookingsData.data || []);
      }
      
  
      setShowBookingForm(false);
      setSelectedEvent(null);
      
    } catch (err) {
      console.error('Error refreshing data after booking:', err);
  
      toast.success('Event booked successfully!');
      setShowBookingForm(false);
      setSelectedEvent(null);
    }
  };


  const hasBookedEvent = (eventId) => {
    if (!isAuthenticated) return false;
    return myBookings.some(booking => 
      booking.event?._id === eventId && booking.status === 'confirmed'
    );
  };


  useEffect(() => {
    if (isAuthenticated) {
      const fetchBookings = async () => {
        try {
          const bookingsData = await getMyBookings();
          setMyBookings(bookingsData.data || []);
        } catch (err) {
          console.error('Error fetching user bookings:', err);
        }
      };
      fetchBookings();
    } else {
      setMyBookings([]);
    }
  }, [isAuthenticated]);

  if (loading || (isAuthenticated && loadingBookings)) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Upcoming Events</h1>
        {isAuthenticated && userRole === 'admin' && (
          <Button as={Link} to="/admin/events/create" variant="primary">
            Create Event
          </Button>
        )}
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {events.length === 0 ? (
        <div className="text-center">
          <p>No upcoming events found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {events.map((event) => (
            <div key={event._id} className="col-md-4">
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={event.image || 'https://via.placeholder.com/300x200?text=Event+Image'} 
                  alt={event.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {event.description?.substring(0, 100)}...
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <small className="d-block text-muted">
                          <i className="bi bi-calendar-event me-1"></i>
                          {new Date(event.dateTime).toLocaleDateString()}
                        </small>
                        <small className="d-block text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {new Date(event.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                      </div>
                      <div className="text-end">
                        <small className="d-block text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {event.location}
                        </small>
                        <small className="d-block">
                          <i className="bi bi-people me-1"></i>
                          <span className={event.availableSeats > 0 ? 'text-success' : 'text-danger'}>
                            {event.availableSeats} of {event.totalSeats} seats available
                          </span>
                          {event.availableSeats <= 0 && !hasBookedEvent(event._id) && (
                            <Badge bg="danger" className="ms-2">Sold Out</Badge>
                          )}
                          {hasBookedEvent(event._id) && (
                            <Badge bg="success" className="ms-2">Booked</Badge>
                          )}
                        </small>
                      </div>
                    </div>
                    <Button 
                      variant={hasBookedEvent(event._id) ? 'success' : (event.availableSeats > 0 ? 'primary' : 'secondary')}
                      className="w-100"
                      onClick={() => handleBookNow(event)}
                      disabled={event.availableSeats <= 0 || hasBookedEvent(event._id)}
                    >
                      {hasBookedEvent(event._id) ? (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Booked
                        </>
                      ) : event.availableSeats > 0 ? (
                        isAuthenticated ? 'Book Now' : 'Login to Book'
                      ) : 'Sold Out'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
      {selectedEvent && (
        <BookingForm
          show={showBookingForm}
          onHide={() => setShowBookingForm(false)}
          event={selectedEvent}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </Container>
  );
};

export default EventsList;
