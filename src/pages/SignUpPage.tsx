import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, Divider, Form } from '@heroui/react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (email && password) {
      dispatch(register({ email }));
      setError('');
      navigate('/');
    } else {
      setError('Please enter email and password');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <Divider />
        {error && <Alert color="danger" className="mb-4">{error}</Alert>}
        <Form onSubmit={handleSignUp} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button color="primary" type="submit" className="w-full">
            Sign Up
          </Button>
        </Form>
        <Divider />
        <div className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-primary underline">Login</a>
        </div>
      </Card>
    </div>
  );
}