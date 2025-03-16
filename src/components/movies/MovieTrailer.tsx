'use client';
import React, { useEffect } from 'react';
import 'lite-youtube-embed/src/lite-yt-embed.css';
import { Video } from '@/lib/types/video';

interface MovieTrailerProps {
  trailer: Video | undefined;
  title: string;
}

export const MovieTrailer: React.FC<MovieTrailerProps> = ({ trailer, title }) => {
  useEffect(() => {
    // Dynamically import lite-youtube-embed only on client side
    import('lite-youtube-embed');
  }, []);

  if (!trailer) {
    return (
      <div className="w-full bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">No hay trailers disponibles para esta película.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg overflow-hidden shadow-lg mx-auto">
        <div className=" p-4 bg-gray-700">
          <h3 className="text-xl font-bold text-white text-center">{trailer.name || 'Trailer Oficial'}</h3>
        </div>
        <div className="relative w-full">
          <div className="relative pl-[10.25%] w-full">
            <lite-youtube
              className="absolute inset-0 w-full h-full"
              videoid={trailer.key}
              playlabel={`Play: ${title} - ${trailer.name || 'Trailer'}`}
              params="modestbranding=1&rel=0"
            ></lite-youtube>
          </div>
        </div>
      </div>
    </div>
  );
};