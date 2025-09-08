import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, Divider, Form } from '@heroui/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Demo: accept any non-empty credentials
    if (email && password) {
      dispatch(login({ email }));
      setError('');
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <Divider />
        {error && <Alert color="danger" className="mb-4">{error}</Alert>}
        <Form onSubmit={handleLogin} className="space-y-4">
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
            Login
          </Button>
        </Form>
        <Divider />
        <div className="mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-primary underline">Sign Up</a>
        </div>
      </Card>
    </div>
  );
}