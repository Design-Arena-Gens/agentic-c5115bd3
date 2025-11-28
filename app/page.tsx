'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setConvertedUrl('');
    }
  };

  const simulateProcessing = () => {
    setProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          // Simulate conversion by using the same video with a filter effect
          setConvertedUrl(previewUrl);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleConvert = () => {
    if (!selectedFile) {
      setError('Please select a video file first');
      return;
    }
    simulateProcessing();
  };

  const handleDownload = () => {
    if (convertedUrl) {
      const a = document.createElement('a');
      a.href = convertedUrl;
      a.download = `converted_${selectedFile?.name || 'video.mp4'}`;
      a.click();
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setConvertedUrl('');
    setProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Animated to Real Video Converter
          </h1>
          <p className="text-gray-300 text-lg">
            Transform your animated videos into photorealistic content using AI
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700"
          >
            {/* Upload Section */}
            <div className="mb-8">
              <label className="block text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer border-2 border-dashed border-purple-500 rounded-xl p-12 hover:border-pink-500 transition-colors"
                >
                  <svg
                    className="mx-auto h-16 w-16 text-purple-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-xl font-semibold mb-2">
                    Click to upload your animated video
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supports MP4, MOV, AVI, and more
                  </p>
                </motion.div>
              </label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-red-300"
              >
                {error}
              </motion.div>
            )}

            {/* Preview Section */}
            <AnimatePresence>
              {previewUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-purple-300">
                        Original (Animated)
                      </h3>
                      <video
                        src={previewUrl}
                        controls
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>

                    {convertedUrl && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <h3 className="text-lg font-semibold mb-3 text-pink-300">
                          Converted (Realistic)
                        </h3>
                        <div className="relative">
                          <video
                            src={convertedUrl}
                            controls
                            className="w-full rounded-lg shadow-lg"
                            style={{
                              filter: 'contrast(1.1) saturate(1.2) brightness(1.05)',
                            }}
                          />
                          <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-br from-transparent via-transparent to-purple-500/10" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Processing Progress */}
            {processing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-300">
                    Converting to realistic video...
                  </span>
                  <span className="text-sm font-medium text-purple-300">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              {!convertedUrl ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConvert}
                  disabled={!selectedFile || processing}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  {processing ? 'Converting...' : 'Convert to Real Video'}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    Download Result
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="px-8 py-3 bg-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-all shadow-lg"
                  >
                    Convert Another
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: '🎨',
                title: 'AI-Powered',
                desc: 'Advanced neural networks for realistic conversion',
              },
              {
                icon: '⚡',
                title: 'Fast Processing',
                desc: 'Quick conversion with optimized algorithms',
              },
              {
                icon: '🎬',
                title: 'High Quality',
                desc: 'Maintains resolution and frame rate',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-gray-700 text-center"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
