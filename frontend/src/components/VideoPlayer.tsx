import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';

interface VideoPlayerProps {
  options: {
    autoplay: boolean;
    controls: boolean;
    fluid: boolean;
    responsive: boolean;
    sources: {
      src: string;
      type: string;
      label: string;
    }[];
  }
}


const VideoPlayer: React.FC<VideoPlayerProps> = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      }));

      // Manually add quality levels based on sources
      options.sources.forEach((source, index) => {
        const button = document.createElement('button');
        button.innerText = source.label;
        button.style.borderRadius = '5px';
        button.onclick = () => {
          // Get the current time before switching
          const currentTime = player.currentTime();
          player.src([{ src: source.src, type: source.type }]);

          // Wait until the video is loaded and then restore the current time
          player.ready(() => {
            player.currentTime(currentTime); // Resume from the same time
            player.play(); // Resume playing the video
          });
        };
        document.getElementById('quality-selector').appendChild(button);
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, onReady]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
      <div id="quality-selector" style={{ marginTop: '10px' }}></div>
    </div>
  );
};

export default VideoPlayer;
