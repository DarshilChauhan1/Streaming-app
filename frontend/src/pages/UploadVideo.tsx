import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { apiUpload } from '../api/index';
import { useAuth } from '../context/AuthContext';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UploadVideo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const {user} = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setThumbnail(e.target.files[0]);
    } else {
      setThumbnail(null);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async()=> {
    try {
      setLoading(true);
      const formData = new FormData();
      if (file) formData.append('files', file);
      if (thumbnail) formData.append('files', thumbnail);

      const payload = {
        title,
        description,
      };
      const userId = user?.id;
      if (userId) payload['userId'] = userId;
      
      formData.append('payload', JSON.stringify(payload));

      const response = await apiUpload(formData);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate('/home');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);  
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        maxWidth: '600px',
        margin: 'auto',
      }}
    >
      <Typography variant="h4">Upload Video</Typography>
      <TextField label="Title" variant="outlined" fullWidth margin="normal" value={title} onChange={(e)=> setTitle(e.target.value)}/>
      <TextField label="Description" variant="outlined" fullWidth margin="normal" value={description} onChange={(e)=> setDescription(e.target.value)} />
      <Button variant="contained" component="label" sx={{ marginBottom: '1rem' }}>
        Choose File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      <Button variant="contained" component="label" sx={{ marginBottom: '1rem' }}>
        Choose Thumbnail
        <input type="file" hidden onChange={handleThumbnailChange} />
      </Button>
      {file && <Typography variant="body1">Video: {file.name}</Typography>}
      {thumbnail && <Typography variant="body1">Thumbnail: {thumbnail.name}</Typography>}
      <LoadingButton variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={handleSubmit} loading={loading}>
        Upload
      </LoadingButton>
    </Box>
  );
};

export default UploadVideo;
