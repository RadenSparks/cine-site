import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { useState } from 'react';
import { addBooking } from '../store/bookingsSlice';
import { motion } from 'framer-motion';
import { Card, Button, Alert, Spinner } from '@heroui/react';

export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movie = useSelector((state: RootState) =>
    state.movies.list.find((m) => m.id === id)
  );
  const seats: number[] = location.state?.seats || [];
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => {
      dispatch(addBooking({ movieId: id!, seats, name }));
      setLoading(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/');
      }, 1500);
    }, 1000);
  }

  if (!movie) return <Alert color="danger">Movie not found.</Alert>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 flex justify-center"
    >
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
        <div className="mb-2">
          <strong>Movie:</strong> {movie.title}
        </div>
        <div className="mb-2">
          <strong>Seats:</strong> {seats.join(', ')}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Your Name:</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <Button
          color="primary"
          disabled={!name || loading}
          onClick={handleConfirm}
          className="w-full flex items-center justify-center"
        >
          {loading ? <Spinner size="sm" className="mr-2" /> : null}
          Confirm Booking
        </Button>
        {showToast && (
          <Alert color="success" className="mt-4">
            Booking confirmed!
          </Alert>
        )}
      </Card>
    </motion.div>
  );
}