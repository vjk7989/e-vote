import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import VoteConfirmation from './VoteConfirmation';

export default function Elections() {
  const { elections, user } = useStore();
  const [selectedVote, setSelectedVote] = useState<{
    electionId: string;
    candidateId: string;
  } | null>(null);

  const handleVoteClick = (electionId: string, candidateId: string) => {
    if (user?.hasVoted) return;
    setSelectedVote({ electionId, candidateId });
  };

  if (elections.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">No Active Elections</h2>
        <p className="text-gray-500 mt-2">Check back later for upcoming elections.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {elections.map((election) => (
        <div key={election.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{election.title}</h2>
              <p className="text-gray-600 mt-1">{election.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                Ends: {new Date(election.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {election.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    className="w-20 h-20 object-cover rounded-full"
                  />
                  <img
                    src={candidate.partySymbol}
                    alt={`${candidate.party} symbol`}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold">{candidate.name}</h3>
                <p className="text-sm text-gray-600">{candidate.party}</p>
                <p className="text-sm text-gray-500 mt-2">{candidate.description}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Votes: {candidate.voteCount}
                  </span>
                  <button
                    onClick={() => handleVoteClick(election.id, candidate.id)}
                    disabled={user?.hasVoted || !election.isActive}
                    className={`px-4 py-2 rounded-md ${
                      user?.hasVoted || !election.isActive
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {user?.hasVoted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : !election.isActive ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      'Vote'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedVote && (
        <VoteConfirmation
          electionId={selectedVote.electionId}
          candidateId={selectedVote.candidateId}
          onCancel={() => setSelectedVote(null)}
        />
      )}
    </div>
  );
}