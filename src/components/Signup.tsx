import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote } from 'lucide-react';
import { useStore } from '../store/useStore';
import { VALIDATION_PATTERNS } from '../types';

export default function Signup() {
  const navigate = useNavigate();
  const addUser = useStore((state) => state.addUser);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    voterId: '',
    aadhar: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const pattern = VALIDATION_PATTERNS[name as keyof typeof VALIDATION_PATTERNS];
    if (!pattern) return true;
    return pattern.test(value);
  };

  const getErrorMessage = (field: string) => {
    switch (field) {
      case 'name':
        return 'Name should contain only letters and spaces (2-50 characters)';
      case 'email':
        return 'Please enter a valid email address';
      case 'voterId':
        return 'Voter ID should be in format ABC1234567';
      case 'aadhar':
        return 'Aadhar number should be 12 digits';
      case 'phone':
        return 'Phone number should be 10 digits starting with 6-9';
      case 'password':
        return 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';
      default:
        return 'Invalid input';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else {
        setErrors((prev) => {
          const { confirmPassword, ...rest } = prev;
          return rest;
        });
      }
    } else {
      if (!validateField(name, value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: getErrorMessage(name),
        }));
      } else {
        setErrors((prev) => {
          const { [name]: removed, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      if (field === 'confirmPassword') {
        if (formData.confirmPassword !== formData.password) {
          newErrors[field] = 'Passwords do not match';
        }
      } else if (!validateField(field, formData[field as keyof typeof formData])) {
        newErrors[field] = getErrorMessage(field);
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      voterId: formData.voterId,
      aadhar: formData.aadhar,
      phone: formData.phone,
      password: formData.password,
      role: 'voter' as const,
      hasVoted: false,
    };

    addUser(newUser);
    navigate('/photo-capture', { state: { userId: newUser.id } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <Vote className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Test user credentials:<br />
            Email: voter@test.com<br />
            Password: password123
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="voterId" className="block text-sm font-medium text-gray-700">
                Voter ID
              </label>
              <input
                id="voterId"
                name="voterId"
                type="text"
                required
                value={formData.voterId}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.voterId ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.voterId && (
                <p className="mt-1 text-sm text-red-600">{errors.voterId}</p>
              )}
            </div>

            <div>
              <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">
                Aadhar Number
              </label>
              <input
                id="aadhar"
                name="aadhar"
                type="text"
                required
                value={formData.aadhar}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.aadhar ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.aadhar && (
                <p className="mt-1 text-sm text-red-600">{errors.aadhar}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}