import React from "react";
import viddioloto from "../assets/vid_dio_loto.mp4";

interface LoadingScreenProps {
  onVideoEnd: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onVideoEnd }) => {
  const screenStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#a359a0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  const videoStyle: React.CSSProperties = {
    height: '100vh',
    width: 'auto',
    maxWidth: '100vw',
    objectFit: 'cover',
  };

  return (
    <div style={screenStyle}>
      <video
        style={videoStyle}
        src={viddioloto}
        autoPlay
        muted
        playsInline
        onEnded={onVideoEnd}
      />
    </div>
  );
};

export default LoadingScreen;