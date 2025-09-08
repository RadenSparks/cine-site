import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '@heroui/react';

export default function MoviePage() {
  const { id } = useParams();
  const movie = useSelector((state: RootState) =>
    state.movies.list.find((m) => m.id === id)
  );
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const navigate = useNavigate();

  const seats = Array.from({ length: 30 }, (_, i) => i + 1);

  function toggleSeat(seat: number) {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  }

  function handleBooking() {
    navigate(`/booking/${id}`, { state: { seats: selectedSeats } });
  }

  if (!movie) return <div className="p-8">Movie not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      <Card className="flex flex-col md:flex-row gap-8">
        <img src={movie.poster} alt={movie.title} className="w-64 h-96 object-cover rounded" />
        <div>
          <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
          <p className="mb-4">{movie.description}</p>
          <h3 className="font-semibold mb-2">Select Seats:</h3>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {seats.map((seat) => (
              <Button
                key={seat}
                color={selectedSeats.includes(seat) ? "primary" : "default"}
                variant={selectedSeats.includes(seat) ? "solid" : "bordered"}
                className="w-10 h-10 p-0"
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </Button>
            ))}
          </div>
          <Button
            color="primary"
            disabled={selectedSeats.length === 0}
            onClick={handleBooking}
            className="w-full"
          >
            Proceed to Booking
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}