import React from 'react';
import { useStore } from '../store/useStore';

export default function UserProfile() {
  const user = useStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl text-gray-500">
                  {user.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {user.votePhotoUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Vote Verification Photo</h3>
              <img
                src={user.votePhotoUrl}
                alt="Vote Verification"
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <p className="mt-1 text-lg">{user.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-lg">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Voter ID</label>
            <p className="mt-1 text-lg">{user.voterId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Aadhar Number</label>
            <p className="mt-1 text-lg">{user.aadhar}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <p className="mt-1 text-lg">{user.phone}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Voting Status</label>
            <p className="mt-1">
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  user.hasVoted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {user.hasVoted ? 'Voted' : 'Not Voted'}
              </span>
            </p>
          </div>

          {user.lastLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-600">Last Login</label>
              <p className="mt-1 text-lg">
                {new Date(user.lastLogin).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}