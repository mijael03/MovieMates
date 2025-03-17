import React from 'react';
import Image from 'next/image';

export default function Loading() {
    return (
        <div className="min-h-screen w-full bg-gray-900 dark:bg-gray-800 flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-8 animate-pulse">
                    <Image
                        src="/moviemate.png"
                        alt="MovieMate Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="animate-bounce"
                        priority
                    />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">Cargando película...</h2>

                <div className="flex justify-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>

                {/* Loading skeleton for movie details */}
                <div className="mt-12 w-full max-w-4xl mx-auto">
                    <div className="relative w-full h-[40vh] mb-8 overflow-hidden rounded-lg bg-gray-700 animate-pulse" />

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="relative w-64 h-96 flex-shrink-0 bg-gray-700 rounded-lg animate-pulse hidden md:block" />

                        <div className="flex-1">
                            <div className="h-10 bg-gray-700 rounded-lg animate-pulse mb-4" />
                            <div className="h-6 bg-gray-700 rounded-lg animate-pulse mb-6 w-3/4" />

                            <div className="flex items-center mb-4 space-x-4">
                                <div className="h-6 w-16 bg-gray-700 rounded-lg animate-pulse" />
                                <div className="h-6 w-16 bg-gray-700 rounded-lg animate-pulse" />
                                <div className="h-6 w-16 bg-gray-700 rounded-lg animate-pulse" />
                            </div>

                            <div className="mb-6">
                                <div className="h-6 bg-gray-700 rounded-lg animate-pulse mb-2 w-1/4" />
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-8 w-20 bg-gray-700 rounded-full animate-pulse" />
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="h-6 bg-gray-700 rounded-lg animate-pulse mb-2 w-1/4" />
                                <div className="h-4 bg-gray-700 rounded-lg animate-pulse mb-2" />
                                <div className="h-4 bg-gray-700 rounded-lg animate-pulse mb-2" />
                                <div className="h-4 bg-gray-700 rounded-lg animate-pulse mb-2" />
                                <div className="h-4 bg-gray-700 rounded-lg animate-pulse mb-2 w-3/4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}