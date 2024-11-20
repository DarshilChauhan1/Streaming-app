import React from 'react';
import { Box, Card, CardContent, CardMedia, Container, Grid, Grid2, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const Home = () => {
  const mockVideos = [
    {
      id: 1,
      title: 'Video 1',
      description: 'This is the first video',
      url: 'https://www.youtube.com/watch?v=1',
      createdAt: '2021-04-01T00:00:00.000Z',
    },
    {
      id: 2,
      title: 'Video 2',
      description: 'This is the second video',
      url: 'https://www.youtube.com/watch?v=2',
      createdAt: '2021-04-02T00:00:00.000Z',
    },
    {
      id: 3,
      title: 'Video 3',
      description: 'This is the third video',
      url: 'https://www.youtube.com/watch?v=3',
      createdAt: '2021-04-03T00:00:00.000Z',
    },
    {
      id: 4,
      title: 'Video 4',
      description: 'This is the fourth video',
      url: 'https://www.youtube.com/watch?v=4',
      createdAt: '2021-04-04T00:00:00.000Z',
    },
    {
      id: 5,
      title: 'Video 5',
      description: 'This is the fifth video',
      url: 'https://www.youtube.com/watch?v=5',
      createdAt: '2021-04-05T00:00:00.000Z',
    },
    {
      id: 6,
      title: 'Video 6',
      description: 'This is the sixth video',
      url: 'https://www.youtube.com/watch?v=6',
      createdAt: '2021-04-06T00:00:00.000Z',
    },
    {
      id: 7,
      title: 'Video 7',
      description: 'This is the seventh video',
      url: 'https://www.youtube.com/watch?v=7',
      createdAt: '2021-04-07T00:00:00.000Z',
    },
    {
      id: 8,
      title: 'Video 8',
      description: 'This is the eighth video',
      url: 'https://www.youtube.com/watch?v=8',
      createdAt: '2021-04-08T00:00:00.000Z',
    },
    {
      id: 9,
      title: 'Video 9',
      description: 'This is the ninth video',
      url: 'https://www.youtube.com/watch?v=9',
      createdAt: '2021-04-09T00:00:00.000Z',
    },
  ];
  return (
    <Box maxWidth='xl' sx={{
        paddingLeft: 0,
    }}>
      <Navbar />
      <Box sx={{ padding: 2, width : '100%' }}>
        <Grid2 container spacing={2} justifyContent="center">
          {mockVideos.slice(0, 9).map((video) => (
            <Grid2
              xs={12}
              sm={6}
              md={2}
              key={video.id}
              display="flex"
              justifyContent="center" // Center cards
            >
              <Card sx={{ width: 400 }}>
                {' '}
                {/* Explicit width to prevent slim cards */}
                <CardMedia component="img" height="180" image={video.thumbnail} alt={video.title} />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {video.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default Home;
