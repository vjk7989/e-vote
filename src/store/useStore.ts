import { create } from 'zustand';
import { User, Election, LoginCredentials, ElectionResult } from '../types';
import { Preferences } from '@capacitor/preferences';

interface Store {
  user: User | null;
  users: User[];
  elections: Election[];
  setUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUserPhoto: (userId: string, photoUrl: string, isVotePhoto?: boolean) => void;
  updateUserLogin: (userId: string) => void;
  setElections: (elections: Election[]) => void;
  addElection: (election: Election) => void;
  vote: (electionId: string, candidateId: string) => void;
  calculateResults: (electionId: string) => ElectionResult[];
  exportToExcel: () => void;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => void;
}

// Demo users
const ADMIN_USER: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@evoting.com',
  voterId: 'ADMIN001',
  aadhar: '999999999999',
  phone: '9999999999',
  password: 'password123',
  role: 'admin',
  hasVoted: false,
  lastLogin: new Date().toISOString(),
};

const TEST_USER: User = {
  id: '2',
  name: 'Test Voter',
  email: 'voter@test.com',
  voterId: 'ABC1234567',
  aadhar: '123456789012',
  phone: '9876543210',
  password: 'password123',
  role: 'voter',
  hasVoted: false,
  lastLogin: new Date().toISOString(),
};

export const useStore = create<Store>((set, get) => ({
  user: null,
  users: [ADMIN_USER, TEST_USER],
  elections: [],
  
  setUser: (user) => {
    set({ user });
    if (user) {
      Preferences.set({ key: 'user', value: JSON.stringify(user) });
    } else {
      Preferences.remove({ key: 'user' });
    }
  },
  
  setUsers: (users) => set({ users }),
  
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  
  updateUserPhoto: (userId, photoUrl, isVotePhoto = false) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? {
              ...user,
              ...(isVotePhoto ? { votePhotoUrl: photoUrl } : { photoUrl }),
            }
          : user
      ),
      user:
        state.user?.id === userId
          ? {
              ...state.user,
              ...(isVotePhoto ? { votePhotoUrl: photoUrl } : { photoUrl }),
            }
          : state.user,
    })),

  updateUserLogin: (userId) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, lastLogin: new Date().toISOString() }
          : user
      ),
    })),

  setElections: (elections) => set({ elections }),
  
  addElection: (election) =>
    set((state) => ({ elections: [...state.elections, election] })),

  vote: (electionId, candidateId) =>
    set((state) => ({
      elections: state.elections.map((election) =>
        election.id === electionId
          ? {
              ...election,
              candidates: election.candidates.map((candidate) =>
                candidate.id === candidateId
                  ? { ...candidate, voteCount: candidate.voteCount + 1 }
                  : candidate
              ),
            }
          : election
      ),
      users: state.users.map((user) =>
        user.id === state.user?.id ? { ...user, hasVoted: true } : user
      ),
      user: state.user ? { ...state.user, hasVoted: true } : null,
    })),

  calculateResults: (electionId) => {
    const election = get().elections.find((e) => e.id === electionId);
    if (!election) return [];

    const totalVotes = election.candidates.reduce(
      (sum, candidate) => sum + candidate.voteCount,
      0
    );

    return election.candidates.map((candidate) => ({
      candidateId: candidate.id,
      candidateName: candidate.name,
      partyName: candidate.party,
      voteCount: candidate.voteCount,
      percentage: totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0,
    }));
  },

  exportToExcel: () => {
    const { elections, users } = get();
    const data = {
      elections: elections.map(election => ({
        ...election,
        results: get().calculateResults(election.id)
      })),
      users: users.map(({ password, ...user }) => user)
    };

    // Create CSV content
    let csv = 'Election Results\n\n';
    
    elections.forEach(election => {
      csv += `${election.title}\n`;
      csv += 'Candidate,Party,Votes,Percentage\n';
      
      const results = get().calculateResults(election.id);
      results.forEach(result => {
        csv += `${result.candidateName},${result.partyName},${result.voteCount},${result.percentage.toFixed(2)}%\n`;
      });
      csv += '\n';
    });

    csv += '\nVoter Details\n';
    csv += 'Name,Email,Voter ID,Aadhar,Phone,Status,Last Login\n';
    users
      .filter(user => user.role === 'voter')
      .forEach(user => {
        csv += `${user.name},${user.email},${user.voterId},${user.aadhar},${user.phone},${user.hasVoted ? 'Voted' : 'Not Voted'},${user.lastLogin || 'Never'}\n`;
      });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `e-voting-data-${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  login: async (credentials) => {
    const { users } = get();
    const user = users.find(
      (u) =>
        (u.email === credentials.identifier ||
          u.voterId === credentials.identifier ||
          u.aadhar === credentials.identifier) &&
        u.password === credentials.password
    );
    if (user) {
      get().setUser(user);
      get().updateUserLogin(user.id);
      return user;
    }
    return null;
  },

  logout: () => {
    set({ user: null });
    Preferences.remove({ key: 'user' });
  },
}));