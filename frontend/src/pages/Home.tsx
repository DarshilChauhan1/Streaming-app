import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { apiGetAllVideos } from '../api/index';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  status?: string;
}

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true); // Initially, loading is true
  const { user } = useAuth();
  const userId = user?.id;

  const fetchVideos = async () => {
    try {
      const response = await apiGetAllVideos({ userId });
      setVideos(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching videos', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false); // Set loading to false after the API call completes
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const navigate = useNavigate();

  const handleCardClick = (video: Video) => {
    navigate(`/home/${video.id}`);
  };

  return (
    <Box maxWidth="xl" sx={{ paddingLeft: 0 }}>
      <Navbar />
      <Grid container spacing={2} justifyContent="center">
        {loading ? (
          <CircularProgress sx={{ marginTop: '20vh' }} />
        ) : (
          <>
            {videos.length === 0 ? (
              <Typography
                variant="h2"
                sx={{
                  marginTop: '20vh',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                No Videos Found
              </Typography>
            ) : (
              videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id} display="flex" justifyContent="center">
                  <Card sx={{ width: 400, cursor: 'pointer' }} onClick={() => handleCardClick(video)}>
                    <CardMedia component="img" height="180" src={video.thumbnailUrl} alt={video.title} />
                    <CardContent>
                      <Typography variant="h6" noWrap>
                        {video.title}
                      </Typography>
                      {video?.status === 'PROCESSING' && (
                        <Typography variant="h5" noWrap>
                          PROCESSING
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Home;
