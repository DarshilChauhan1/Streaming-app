import { Button, Container, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { LoadingButton } from '@mui/lab';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowPassword = () => setShowPassword((prev) => !prev);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const response = await login(data);
    if (response?.success) {
      navigate('/home');
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
        width: '100%',
      }}
    >
      <Paper
        sx={{
          padding: '2rem',
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: '1.5rem' }}>
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit(async (data) => await onSubmit(data))}>
          <TextField
            required
            fullWidth
            margin="normal"
            label="Email"
            {...register('email', {
              required: {
                value: true,
                message: 'Email is required',
              },
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
                value: true,
                message: 'Password is required',
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
            Login
          </LoadingButton>
        </form>

        <Typography variant="body1" sx={{ marginTop: '1.5rem' }}>
          Create an account{'   '}
          <Link
            to="/signup"
            style={{
              color: 'blue',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Signup
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
