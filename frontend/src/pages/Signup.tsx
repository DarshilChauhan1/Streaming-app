import React, { ReactElement, useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { LoadingButton } from '@mui/lab';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = (): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const { registerAsync } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const result = await registerAsync(data);
    if (result?.success) {
      navigate('/login', { state: { message: result?.message || 'User created successfully' } });
    }
    setLoading(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Paper
        sx={{
          padding: '2rem',
          marginTop: '1rem',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: '1.5rem' }}>
          Sign Up
        </Typography>
        <form noValidate onSubmit={handleSubmit(async (data) => await onSubmit(data))}>
          <TextField
            required
            fullWidth
            margin="normal"
            label="First Name"
            {...register('firstName', {
              required: {
                message: 'First Name is required',
                value: true,
              },
            })}
            error={errors.firstName} // Display error state
            helperText={errors.firstName?.message} // Show the error message
            sx={{ width: '100%' }} // Ensures the TextField maintains full width
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Last Name"
            {...register('lastName', {
              required: {
                message: 'Last Name is required',
                value: true,
              },
            })}
            error={errors?.lastName}
            helperText={errors?.lastName?.message}
            sx={{ width: '100%' }}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Email"
            {...register('email', {
              required: {
                message: 'Email is required',
                value: true,
              },
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors?.email}
            helperText={errors?.email?.message}
            sx={{ width: '100%' }}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Password"
            {...register('password', {
              required: {
                message: 'Password is required',
                value: true,
              },
            })}
            type={showPassword ? 'text' : 'password'}
            error={errors?.password}
            helperText={errors?.password?.message}
            sx={{ width: '100%' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleShowPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            loading={loading}
            sx={{
              padding: '0.75rem',
              marginTop: '1rem',
            }}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Sign Up
          </LoadingButton>
        </form>

        <Typography variant="body1" sx={{ marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'blue',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;
