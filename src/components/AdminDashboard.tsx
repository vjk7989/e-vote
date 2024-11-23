import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BarChart3, Users, Download, FileSpreadsheet } from 'lucide-react';
import { useStore } from '../store/useStore';
import UserManagement from './UserManagement';
import ElectionResults from './ElectionResults';

export default function AdminDashboard() {
  const { elections, users, exportToExcel } = useStore();
  const voters = users.filter((user) => user.role === 'voter');
  const [selectedElection, setSelectedElection] = useState<string | null>(null);

  const exportData = () => {
    const data = {
      elections: elections.map(election => ({
        ...election,
        results: useStore.getState().calculateResults(election.id)
      })),
      users: users.map(({ password, ...user }) => user)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-voting-data-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export to Excel</span>
          </button>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            <span>Export JSON</span>
          </button>
          <Link
            to="/create-election"
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Election</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold">Total Elections</h2>
          </div>
          <p className="text-3xl font-bold mt-4">{elections.length}</p>
          <p className="text-sm text-gray-500 mt-2">
            Active: {elections.filter(e => e.isActive).length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold">Registered Voters</h2>
          </div>
          <p className="text-3xl font-bold mt-4">{voters.length}</p>
          <p className="text-sm text-gray-500 mt-2">
            With Photos: {voters.filter(v => v.photoUrl).length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-semibold">Voted Users</h2>
          </div>
          <p className="text-3xl font-bold mt-4">
            {voters.filter((user) => user.hasVoted).length}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Turnout: {((voters.filter((user) => user.hasVoted).length / voters.length) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <UserManagement />
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Election Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Votes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {elections.map((election) => {
                    const totalVotes = election.candidates.reduce(
                      (sum, candidate) => sum + candidate.voteCount,
                      0
                    );
                    return (
                      <tr key={election.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {election.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(election.startDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(election.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              election.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {election.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {election.candidates.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {totalVotes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedElection(election.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Results
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedElection && (
          <ElectionResults electionId={selectedElection} />
        )}
      </div>
    </div>
  );
}