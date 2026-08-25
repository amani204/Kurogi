import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cancelBookingRequest } from '../../features/booking/api';
import Button from '../../comonents/ui/Button';

const BookingCancel = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleCancel = async () => {
    setStatus('loading');
    try {
      const data = await cancelBookingRequest(token);
      setMessage(data.message || 'Booking cancelled.');
      setStatus('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'This booking could not be cancelled.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <h1 className="font-display text-4xl md:text-5xl">Booking cancelled</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>
        <Link to="/" className="hairline-link label mt-10 text-foreground">Back to homepage</Link>
      </main>
    );
  }

  return (
    <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
      <p className="label text-shu">Reservation</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">Cancel this booking?</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">This can't be undone.</p>

      {status === 'error' && <p className="mt-4 text-sm text-shu">{message}</p>}

      <div className="mt-10 flex items-center gap-6">
        <Link to="/" className="hairline-link label text-muted-foreground">Keep my booking</Link>
        <Button variant="primary" onClick={handleCancel} disabled={status === 'loading'}>
          {status === 'loading' ? 'Cancelling...' : 'Yes, cancel it'}
        </Button>
      </div>
    </main>
  );
};

export default BookingCancel;