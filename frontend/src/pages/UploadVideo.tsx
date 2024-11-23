import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { apiUpload } from '../api/index';

const UploadVideo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  const handleSubmit = async()=> {
    try {
      const formData = new FormData();
      if (file) formData.append('files', file);
      if (thumbnail) formData.append('files', thumbnail);

      const payload = {
        title,
        description,
      };
      formData.append('payload', JSON.stringify(payload));

      const response = await apiUpload(formData);
      console.log(response);
    } catch (error) {
      console.log(error);
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
      <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={handleSubmit}>
        Upload
      </Button>
    </Box>
  );
};

export default UploadVideo;
