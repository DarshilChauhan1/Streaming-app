import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import VideoPlayer from '../components/VideoPlayer';
import { apiGetVideo } from '../api/index';
import videojs from 'video.js';
import { toast } from 'react-toastify';

const Player = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await apiGetVideo({ videoId: id });
      if (response?.data?.success === false) {
        toast.error(response?.data?.message);
      } else {
        setVideo(response?.data?.data);
      }
    };
    fetchVideo();
  }, [id]);

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on('waiting', () => videojs.log('player is waiting'));
    player.on('dispose', () => videojs.log('player will dispose'));
  };

  if (!video) return <Container sx={{ marginTop: 10, height : '70vh', display : 'flex', justifyContent : 'center', alignItems : 'center' }}><CircularProgress /></Container>;

  const playerOptions = {
    autoplay: true,
    controls: true,
    fluid: true,
    responsive: true,
    sources: Object.entries(video.m3u8Url).map(([label, src]) => ({
      src,
      type: 'application/x-mpegURL',
      label: label,
    })),
  };

  return (
    <Box sx={{ width: '80%', margin: 'auto', padding: 2 }}>
      <VideoPlayer options={playerOptions} onReady={handlePlayerReady} />
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        {video.title}
      </Typography>
    </Box>
  );
};

export default Player;
