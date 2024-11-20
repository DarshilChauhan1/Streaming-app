import React, { ReactElement, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup = (): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword((prev)=> !prev);

  const onSubmit = (data: any) => console.log('data--->', data);
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
        <form noValidate onSubmit={handleSubmit((data)=> console.log("data", data))}>
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
            error={errors.firstName}  // Display error state
            helperText={errors.firstName?.message} // Show the error message
            sx={{ width: '100%' }}  // Ensures the TextField maintains full width
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
              pattern : {
                value : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                message : "Invalid email address"
              }
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
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }} 
          />
          <Button
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
          </Button>
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
