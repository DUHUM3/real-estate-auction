import React from 'react';
import { FaPlay, FaTimes } from 'react-icons/fa';
import { getVideoUrl } from '../../constants/auction.constants';

const VideoGallery = ({ videos, onSelectVideo }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
        فيديوهات المزاد
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="relative rounded-xl overflow-hidden cursor-pointer group border-2 border-gray-200 hover:border-blue-500 transition-all"
            onClick={() => onSelectVideo(video)}
          >
            <video
              src={getVideoUrl(video.video_path)}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
              <div className="p-4 bg-white bg-opacity-90 rounded-full">
                <FaPlay className="text-blue-500 text-2xl" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 px-3 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
              فيديو {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Modal Component
VideoGallery.Modal = ({ video, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={getVideoUrl(video.video_path)}
          controls
          autoPlay
          className="w-full h-auto rounded-lg"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
          onClick={onClose}
        >
          <FaTimes className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default VideoGallery;