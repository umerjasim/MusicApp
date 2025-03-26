import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { PlayCircleOutlined, PauseCircleOutlined, FastBackwardOutlined, FastForwardOutlined } from '@ant-design/icons';
import { Slider, Button, Row, Col, Typography } from 'antd';
// import 'antd/dist/antd.css';
import './App.css';

// Import songs data from JSON (you can now directly import the MP3 files using import syntax)
import songsData from './songs.json';
import boy from './Assets/boy.png';
import girl from './Assets/girl.png';
import catMouse from './Assets/cat-mouse.png';

const { Text, Title } = Typography;

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Current progress of the song (in seconds)
  const [duration, setDuration] = useState(0); // Total duration of the song (in seconds)
  const [currentTime, setCurrentTime] = useState(0); // Current time of the song (in seconds)
  const [songIndex, setSongIndex] = useState(0); // Index of the current song
  const [songs, setSongs] = useState<any[]>([]); // Array of song data

  const playerRef = useRef<ReactPlayer | null>(null);

  // Fetch the songs data from the JSON file
  useEffect(() => {
    const updatedSongs = songsData.map((song) => ({
      ...song,
      file: require(`${song.file}`), // Dynamically import the MP3 files
    }));

    setSongs(updatedSongs); // Set songs state with audio file paths
  }, []);

  // Manage audio element behavior and playback
  useEffect(() => {
    if (songs.length > 0) {
      setDuration(playerRef.current?.getDuration() || 0);
    }
  }, [songIndex, songs]);

  // Handle progress and update current time
  const handleProgress = (progress: any) => {
    setProgress(progress.playedSeconds);
    setCurrentTime(progress.playedSeconds);
  };

  // Handle the duration change
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // Handle slider change
  const handleSliderChange = (value: number) => {
    setProgress(value);
    setCurrentTime(value);

    if (playerRef.current) {
      playerRef.current.seekTo(value, 'seconds'); // Use seekTo to update the currentTime directly
    }
  };

  // Play or pause the audio when the play/pause button is clicked
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle next song and play it automatically
  const handleNextSong = () => {
    setSongIndex((prevIndex) => (prevIndex + 1) % songs.length); // Go to the next song
    setProgress(0); // Reset progress when the song changes
    setCurrentTime(0); // Reset current time when the song changes
    setIsPlaying(true); // Start playing the new song
  };

  // Handle previous song and play it automatically
  const handlePrevSong = () => {
    setSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length); // Go to the previous song
    setProgress(0); // Reset progress when the song changes
    setCurrentTime(0); // Reset current time when the song changes
    setIsPlaying(true); // Start playing the previous song
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`; // Format time as mm:ss
  };

  return (
    <div className="music-player-container">
        <Row justify="center" align="middle">
            <Col xs={24} sm={24} md={18} lg={16} xl={14}>
            <div className="song-info">
                {songs.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    {/* Left image */}
                    <div style={{ flex: 1, marginRight: 10 }}>
                    <img src={boy} style={{ width: '100%', maxWidth: '110px', height: 'auto' }} alt="Boy" />
                    </div>

                    {/* Title and artist centered */}
                    <div style={{ textAlign: 'center', flex: 2, whiteSpace: 'nowrap' }}>
                    <Title level={1} className="delius-regular" style={{ fontSize: '2.5rem', whiteSpace: 'nowrap' }}>
                        {songs[songIndex].title}
                    </Title>
                    <Text className="artist-name" style={{ whiteSpace: 'nowrap' }}>
                        {songs[songIndex].artist}
                    </Text>
                    </div>

                    {/* Right image */}
                    <div style={{ flex: 1, marginLeft: 10 }}>
                    <img src={girl} style={{ width: '100%', maxWidth: '120px', height: 'auto' }} alt="Girl" />
                    </div>
                </div>
                )}
                <Row style={{ marginTop: 20 }}>
                <Col span={24}>
                    <img src={catMouse} style={{ width: '100%', height: 'auto' }} alt="Boy" />
                </Col>
                </Row>
                <Row style={{ marginTop: 20 }} justify={'center'}>
                <Col>
                    <Text className="artist-name" style={{ whiteSpace: 'nowrap', fontSize: '2rem' }}>
                    A True Story
                    </Text>
                </Col>
                </Row>
                <div className="progress-container">
                <Row justify="space-between" align="middle">
                    <Col>{formatTime(currentTime)}</Col>
                    <Col>{formatTime(duration)}</Col>
                </Row>
                <Slider
                    value={progress}
                    max={duration}
                    onChange={handleSliderChange} // Update the current time when slider changes
                    tooltipVisible={false} // Remove the default tooltip
                    style={{ width: '100%' }}
                />
                </div>
            </div>
            <div className="controls">
                <Button
                shape="circle"
                icon={<FastBackwardOutlined />}
                size="large"
                onClick={handlePrevSong} // Switch to the previous song
                style={{ marginRight: 10 }}
                />
                <Button
                shape="circle"
                icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                size="large"
                onClick={togglePlayPause} // Toggle play/pause
                />
                <Button
                shape="circle"
                icon={<FastForwardOutlined />}
                size="large"
                onClick={handleNextSong} // Switch to the next song
                style={{ marginLeft: 10 }}
                />
            </div>
            </Col>
        </Row>

        {/* ReactPlayer Component */}
        <ReactPlayer
            ref={playerRef}
            url={songs[songIndex]?.file}
            playing={isPlaying}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={handleNextSong} // Automatically go to next song when current one ends
            width="0" // Hide the player
            height="0" // Hide the player
        />
        </div>
  );
};

export default MusicPlayer;
