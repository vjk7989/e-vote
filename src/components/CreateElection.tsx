import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Candidate } from '../types';

export default function CreateElection() {
  const navigate = useNavigate();
  const addElection = useStore((state) => state.addElection);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [candidates, setCandidates] = useState<Omit<Candidate, 'id' | 'voteCount'>[]>([]);

  const handleAddCandidate = () => {
    setCandidates([
      ...candidates,
      {
        name: '',
        party: '',
        description: '',
        imageUrl: `https://source.unsplash.com/random/400x300?portrait&${Date.now()}`,
        partySymbol: `https://source.unsplash.com/random/200x200?symbol&${Date.now()}`,
      },
    ]);
  };

  const handleRemoveCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleCandidateChange = (
    index: number,
    field: keyof Omit<Candidate, 'id' | 'voteCount'>,
    value: string
  ) => {
    const newCandidates = [...candidates];
    newCandidates[index] = { ...newCandidates[index], [field]: value };
    setCandidates(newCandidates);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const election = {
      id: Date.now().toString(),
      title,
      description,
      startDate,
      endDate,
      isActive: true,
      candidates: candidates.map((candidate) => ({
        ...candidate,
        id: Date.now().toString() + Math.random(),
        voteCount: 0,
      })),
    };

    addElection(election);
    navigate('/admin');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Create New Election</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Election Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Candidates</h2>
            <button
              type="button"
              onClick={handleAddCandidate}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Candidate</span>
            </button>
          </div>

          <div className="space-y-6">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-4 relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveCandidate(index)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={candidate.name}
                      onChange={(e) =>
                        handleCandidateChange(index, 'name', e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Party
                    </label>
                    <input
                      type="text"
                      value={candidate.party}
                      onChange={(e) =>
                        handleCandidateChange(index, 'party', e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={candidate.description}
                    onChange={(e) =>
                      handleCandidateChange(index, 'description', e.target.value)
                    }
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Party Symbol URL
                  </label>
                  <input
                    type="url"
                    value={candidate.partySymbol}
                    onChange={(e) =>
                      handleCandidateChange(index, 'partySymbol', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Election
          </button>
        </div>
      </form>
    </div>
  );
}