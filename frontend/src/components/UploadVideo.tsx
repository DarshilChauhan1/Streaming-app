import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const UploadVideo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files) {
      setThumbnail(e.target.files[0]);
    } else {
      setThumbnail(null);
    }
  };
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
      <TextField label="Title" variant="outlined" fullWidth margin="normal" />
      <TextField label="Description" variant="outlined" fullWidth margin="normal" />
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
      <Button variant="contained" color="primary" onClick={() => console.log()} sx={{ marginTop: '1rem' }}>
        Upload
      </Button>
    </Box>
  );
};

export default UploadVideo;
