import { useEffect, useState } from 'react';
import {
  addBooking,
  addCar,
  addCustomer,
  fetchBookings,
  fetchCars,
  fetchCustomers
} from './api';

function App() {
  // Cars State
  const [cars, setCars] = useState([]);
  const [carForm, setCarForm] = useState({
    make: '',
    model: '',
    year: '',
    pricePerDay: '',
    available: true,
    imagePath: ''
  });

  // Customers State
  const [customers, setCustomers] = useState([]);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    licenseNumber: '',
    phone: '',
    email: ''
  });

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    carId: '',
    customerId: '',
    startDate: '',
    endDate: ''
  });

  // Load data on init
  useEffect(() => {
    loadCars();
    loadCustomers();
    loadBookings();
  }, []);

  // Fetch functions
  const loadCars = async () => {
    try {
      const res = await fetchCars();
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await fetchCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await fetchBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Forms Change Handlers
  const onCarChange = e => {
    const { name, value } = e.target;
    setCarForm(prev => ({ ...prev, [name]: value }));
  };

  const onCustomerChange = e => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [name]: value }));
  };

  const onBookingChange = e => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  // Forms Submit Handlers
  const addCarSubmit = async e => {
    e.preventDefault();
    try {
      await addCar({
        ...carForm,
        year: parseInt(carForm.year),
        pricePerDay: parseFloat(carForm.pricePerDay),
        available: carForm.available === 'true' || carForm.available === true
      });
      setCarForm({ make: '', model: '', year: '', pricePerDay: '', available: true, imagePath: '' });
      loadCars();
    } catch (err) {
      alert('Error adding car');
    }
  };

  const addCustomerSubmit = async e => {
    e.preventDefault();
    try {
      await addCustomer(customerForm);
      setCustomerForm({ name: '', licenseNumber: '', phone: '', email: '' });
      loadCustomers();
    } catch (err) {
      alert('Error adding customer');
    }
  };

  const addBookingSubmit = async e => {
    e.preventDefault();
    try {
      const car = cars.find(c => c.id === parseInt(bookingForm.carId));
      const start = new Date(bookingForm.startDate);
      const end = new Date(bookingForm.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const totalPrice = car.pricePerDay * days;

      await addBooking({
        car: { id: car.id },
        customer: { id: parseInt(bookingForm.customerId) },
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        totalPrice
      });

      setBookingForm({ carId: '', customerId: '', startDate: '', endDate: '' });
      loadBookings();
      alert('Booking successful!');
    } catch (err) {
      alert('Failed to add booking');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>GVK Car Rental Booking services portal,India</h1>

      {/* Cars Section */}
      <section>
        <h2>Cars</h2>
        <form onSubmit={addCarSubmit} style={{ marginBottom: 20 }}>
          <input name="make" placeholder="Make" value={carForm.make} onChange={onCarChange} required />
          <input name="model" placeholder="Model" value={carForm.model} onChange={onCarChange} required />
          <input name="year" placeholder="Year" type="number" value={carForm.year} onChange={onCarChange} required />
          <input name="pricePerDay" placeholder="Price Per Day" type="number" step="0.01" value={carForm.pricePerDay} onChange={onCarChange} required />
          <select name="available" value={carForm.available} onChange={onCarChange}>
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>
          <input name="imagePath" placeholder="Image Path" value={carForm.imagePath} onChange={onCarChange} />
          <button type="submit">Add Car</button>
        </form>
        <ul>
          {cars.map(car => (
            <li key={car.id}>{car.make} {car.model} ({car.year}) - ${car.pricePerDay}/day - {car.available ? 'Available' : 'Not Available'}</li>
          ))}
        </ul>
      </section>

      {/* Customers Section */}
      <section>
        <h2>Customers</h2>
        <form onSubmit={addCustomerSubmit} style={{ marginBottom: 20 }}>
          <input name="name" placeholder="Name" value={customerForm.name} onChange={onCustomerChange} required />
          <input name="licenseNumber" placeholder="License Number" value={customerForm.licenseNumber} onChange={onCustomerChange} required />
          <input name="phone" placeholder="Phone" value={customerForm.phone} onChange={onCustomerChange} />
          <input name="email" placeholder="Email" value={customerForm.email} onChange={onCustomerChange} />
          <button type="submit">Add Customer</button>
        </form>
        <ul>
          {customers.map(cust => (
            <li key={cust.id}>{cust.name} - License: {cust.licenseNumber}</li>
          ))}
        </ul>
      </section>

      {/* Booking Section */}
      <section>
        <h2>Bookings</h2>
        <form onSubmit={addBookingSubmit} style={{ marginBottom: 20 }}>
          <select name="carId" value={bookingForm.carId} onChange={onBookingChange} required>
            <option value="">Select Car</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>{car.make} {car.model} ({car.year})</option>
            ))}
          </select>

          <select name="customerId" value={bookingForm.customerId} onChange={onBookingChange} required>
            <option value="">Select Customer</option>
            {customers.map(cust => (
              <option key={cust.id} value={cust.id}>{cust.name}</option>
            ))}
          </select>

          <input type="date" name="startDate" value={bookingForm.startDate} onChange={onBookingChange} required />
          <input type="date" name="endDate" value={bookingForm.endDate} onChange={onBookingChange} required />
          <button type="submit">Add Booking</button>
        </form>

        <ul>
          {bookings.map(booking => (
            <li key={booking.id}>
              Booking #{booking.id}: {booking.customer?.name} booked {booking.car?.make} {booking.car?.model} from {booking.startDate} to {booking.endDate} - Total: ${booking.totalPrice.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
