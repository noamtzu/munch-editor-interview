import { useContext, useEffect, useState } from 'react';
import { videoContext } from '../../context/videoContext';
import vid from '../../assets/horiz.mp4';
import './Display.css';

export const Display = () => {
    const { video, endTime, startTime, isOn } = useContext(videoContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if(video?.current) {
            video.current.addEventListener('timeupdate', checkBoundaries)
        }

        return () => {
            if(video?.current) {
                video.current?.removeEventListener('timeupdate', checkBoundaries)
            }
        }
    }, [video?.current, endTime, startTime])

    const checkBoundaries = () => {
        if(!isOn) { return }

        if(video?.current && video.current.currentTime > endTime) {
            video.current.currentTime = endTime;
            video.current.pause();
        }
    }

    const togglePlayPause = () => {
        if (video?.current) {
            if (isPlaying) {
                video.current.pause();
            } else {
                video.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (video?.current) {
            setCurrentTime(video.current.currentTime);
            setDuration(video.current.duration);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (video?.current) {
            const clickedPosition = e.nativeEvent.offsetX;
            const progressBarWidth = e.currentTarget.clientWidth;
            const clickedTime = (clickedPosition / progressBarWidth) * duration;
            video.current.currentTime = clickedTime;
        }
    };

    return (
        <div className='Display' data-loading={!isOn}>
            <video ref={video} width="100%" height="100%" preload="auto" onTimeUpdate={handleTimeUpdate}>
                <source src={vid} type="video/mp4"/>
            </video>
            <div>
                <button className="play-pause-button" onClick={togglePlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <div className="progress-bar-container" onClick={handleProgressClick}>
                    <div className="progress-bar" style={{width: `${(currentTime / duration) * 100}%`}}></div>
                </div>
            </div>
        </div>
    )
}