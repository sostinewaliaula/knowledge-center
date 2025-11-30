import { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2 } from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    file_type?: string | null;
    source_type?: string | null;
    source_url?: string | null;
    embed_code?: string | null;
    file_name?: string | null;
  };
  videoUrl?: string; // For local videos
}

export function VideoPlayerModal({ isOpen, onClose, content, videoUrl }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setIsPlaying(false);
      setIsLoading(true);
      setCurrentTime(0);
      setDuration(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      const video = videoRef.current;
      
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setDuration(video.duration);
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setIsLoading(false);
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      video.addEventListener('loadeddata', handleLoadedMetadata);
      video.addEventListener('canplay', () => setIsLoading(false));
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
        video.removeEventListener('loadeddata', handleLoadedMetadata);
        video.removeEventListener('canplay', () => setIsLoading(false));
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume, isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isExternalVideo = content.source_type && 
    ['youtube', 'vimeo', 'dailymotion'].includes(content.source_type);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 overflow-y-auto"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      style={{ zIndex: 40 }}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Always visible */}
        <div className="bg-gradient-to-r from-purple-600 to-green-600 p-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-white text-lg font-semibold truncate flex-1 mr-4">
            {content.title || content.file_name || 'Video Player'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            title="Close (ESC)"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Video Container - Flexible height with max constraint */}
        <div 
          className="relative w-full bg-black flex-shrink min-h-0"
          style={{ 
            aspectRatio: '16/9',
            maxHeight: 'calc(90vh - 80px)'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {isExternalVideo && content.embed_code ? (
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: content.embed_code }}
              />
            ) : videoUrl ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <Loader2 size={48} className="text-white animate-spin" />
                  </div>
                )}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onClick={togglePlay}
                >
                  Your browser does not support the video tag.
                </video>
              </>
            ) : (
              <div className="text-white text-center">
                <p>Video source not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Custom Controls for Local Videos */}
        {!isExternalVideo && videoUrl && (
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <span className="text-white text-xs w-16 text-right">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(currentTime / (duration || 1)) * 100}%, #4b5563 ${(currentTime / (duration || 1)) * 100}%, #4b5563 100%)`
                  }}
                />
                <span className="text-white text-xs w-16">{formatTime(duration)}</span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-white" />
                    ) : (
                      <Play size={20} className="text-white" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX size={20} className="text-white" />
                      ) : (
                        <Volume2 size={20} className="text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize size={20} className="text-white" />
                  ) : (
                    <Maximize size={20} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

