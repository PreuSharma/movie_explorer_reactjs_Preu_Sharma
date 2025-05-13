import axios from 'axios';
import { createSubscription, getSubscriptionStatus, verifySubscription } from '../services/Subscription'; // Adjust this
import toast from 'react-hot-toast';

jest.mock('axios');
jest.mock('react-hot-toast');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Subscription API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('createSubscription returns checkout URL on success', async () => {
    const mockUrl = 'https://checkout.example.com';
    localStorage.setItem('token', 'test-token');
    mockedAxios.post.mockResolvedValue({
      data: { checkoutUrl: mockUrl },
    });

    const result = await createSubscription('premium');

    expect(result).toBe(mockUrl);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/subscriptions'),
      { plan_type: 'premium' },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  test('createSubscription throws if no token is found', async () => {
    await expect(createSubscription('basic')).rejects.toThrow('No authentication token found');
    expect(toast.error).toHaveBeenCalledWith('You need to sign in first.');
  });

  test('createSubscription throws if checkoutUrl is missing', async () => {
    localStorage.setItem('token', 'test-token');
    mockedAxios.post.mockResolvedValue({ data: {} });

    await expect(createSubscription('basic')).rejects.toThrow('No checkout URL returned from server.');
  });

  test('getSubscriptionStatus returns data on success', async () => {
    const mockResponse = { status: 'active', plan: 'premium' };
    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await getSubscriptionStatus('valid-token');

    expect(result).toEqual(mockResponse);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/subscriptions/status'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer valid-token' },
      })
    );
  });

  test('getSubscriptionStatus throws if no token is passed', async () => {
    await expect(getSubscriptionStatus('')).rejects.toThrow('An unexpected error occurred');
    expect(toast.error).toHaveBeenCalledWith('You need to sign in first.');
  });





test('verifySubscription returns data on success', async () => {
  const sessionId = 'test-session-id';
  const token = 'test-token';
  const mockData = { status: 'success', plan: 'premium' };

  mockedAxios.get.mockResolvedValueOnce({ data: mockData });

  const result = await verifySubscription(sessionId, token);

  expect(mockedAxios.get).toHaveBeenCalledWith(
    `https://movie-explorer-ror-amansharma.onrender.com/api/v1/subscriptions/success?session_id=${sessionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  expect(result).toEqual(mockData);
});

test('verifySubscription throws error if sessionId is missing', async () => {
  await expect(verifySubscription('', 'some-token')).rejects.toThrow('No session ID found in the URL.');
});

test('verifySubscription throws error if authToken is missing', async () => {
  await expect(verifySubscription('some-session-id', '')).rejects.toThrow('Authentication token not found. Please log in again.');
});
});
