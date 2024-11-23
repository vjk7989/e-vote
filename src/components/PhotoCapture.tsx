import React, { useCallback, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Camera as CapacitorCamera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

export default function PhotoCapture() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const updateUserPhoto = useStore((state) => state.updateUserPhoto);
  const user = useStore((state) => state.user);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capturePhoto = useCallback(async () => {
    if (Capacitor.isNative) {
      try {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: 'base64',
        });

        if (image.base64String) {
          const fileName = `user-${userId || user?.id}-${Date.now()}.jpeg`;
          await Filesystem.writeFile({
            path: fileName,
            data: image.base64String,
            directory: Directory.Data,
          });

          const photoPath = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Data,
          });

          updateUserPhoto(userId || user?.id || '', photoPath.uri);
          setPhotoUrl(`data:image/jpeg;base64,${image.base64String}`);
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    } else {
      const screenshot = webcamRef.current?.getScreenshot();
      if (screenshot) {
        setPhotoUrl(screenshot);
        updateUserPhoto(userId || user?.id || '', screenshot);
      }
    }
  }, [userId, user, updateUserPhoto]);

  const handleContinue = () => {
    navigate(user?.role === 'admin' ? '/admin' : '/elections');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <Camera className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Take Your Photo
          </h2>
          <p className="mt-2 text-gray-600">
            This photo will be used for verification purposes
          </p>
        </div>

        <div className="space-y-6">
          {!photoUrl ? (
            <div className="relative">
              {Capacitor.isNative ? (
                <button
                  onClick={capturePhoto}
                  className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Camera className="h-12 w-12 text-gray-400" />
                </button>
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg"
                />
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                src={photoUrl}
                alt="Captured"
                className="w-full rounded-lg"
              />
            </div>
          )}

          <div className="flex space-x-4">
            {!photoUrl ? (
              <button
                onClick={capturePhoto}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Take Photo
              </button>
            ) : (
              <>
                <button
                  onClick={() => setPhotoUrl(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retake
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}