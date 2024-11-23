import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Camera as CapacitorCamera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

interface VoteConfirmationProps {
  electionId: string;
  candidateId: string;
  onCancel: () => void;
}

export default function VoteConfirmation({
  electionId,
  candidateId,
  onCancel,
}: VoteConfirmationProps) {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const { user, vote, updateUserPhoto } = useStore();
  const [photoTaken, setPhotoTaken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const capturePhoto = async () => {
    if (!user) return;

    try {
      let photoData: string | null = null;

      if (Capacitor.isNative) {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: 'base64',
        });

        if (image.base64String) {
          const fileName = `vote-${user.id}-${Date.now()}.jpeg`;
          await Filesystem.writeFile({
            path: fileName,
            data: image.base64String,
            directory: Directory.Data,
          });

          const photoPath = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Data,
          });

          photoData = photoPath.uri;
        }
      } else {
        photoData = webcamRef.current?.getScreenshot() || null;
      }

      if (photoData) {
        setPhotoTaken(photoData);
      }
    } catch (error) {
      console.error('Error capturing vote photo:', error);
    }
  };

  const handleConfirmVote = async () => {
    if (!user || !photoTaken || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      updateUserPhoto(user.id, photoTaken, true);
      vote(electionId, candidateId);
      navigate('/elections');
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Confirm Your Vote</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Please take a photo to confirm your vote. This helps ensure the integrity
            of the voting process.
          </p>

          {photoTaken ? (
            <img
              src={photoTaken}
              alt="Vote confirmation"
              className="w-full rounded-lg"
            />
          ) : Capacitor.isNative ? (
            <button
              onClick={capturePhoto}
              className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500"
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

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          {photoTaken ? (
            <button
              onClick={handleConfirmVote}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Vote'}
            </button>
          ) : (
            <button
              onClick={capturePhoto}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Take Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}