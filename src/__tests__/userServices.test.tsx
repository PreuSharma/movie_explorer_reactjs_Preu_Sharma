import {
  signUpUser,
  loginUser,
  logoutUser,
  sendTokenToBackend,
} from '../services/userServices'; 
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Auth API functions using global fetch mock', () => {
  test('signUpUser - should return data on successful signup', async () => {
    const mockResponse = { message: 'Signup successful' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const user = {
      name: 'John',
      email: 'john@example.com',
      password: '123456',
      mobile_number: '9999999999',
      role: 'user',
    };

    const data = await signUpUser(user);
    expect(data).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ user }),
      })
    );
  });

  test('signUpUser - should throw error on failed signup', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Email already taken' }),
    } as any);

    await expect(
      signUpUser({
        name: 'Jane',
        email: 'jane@example.com',
        password: '123',
        mobile_number: '0000000000',
      })
    ).rejects.toThrow('Email already taken');
  });

  test('loginUser - should return data and status on successful login', async () => {
    const mockResponse = { token: 'abc123' };
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const payload = {
      user: {
        email: 'john@example.com',
        password: 'password',
      },
    };

    const result = await loginUser(payload);
    expect(result).toEqual({ data: mockResponse, status: 200 });
    expect(global.fetch).toHaveBeenCalled();
  });

  test('logoutUser - should return success on logout', async () => {
    localStorage.setItem('token', 'mock-token');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
    } as any);

    const result = await logoutUser();
    expect(result).toEqual({ message: 'Logout successful', status: 200 });
  });

  test('logoutUser - should throw error on failure', async () => {
    localStorage.setItem('token', 'mock-token');
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Logout failed' }),
    } as any);

    await expect(logoutUser()).rejects.toThrow('Logout failed');
  });

  test('sendTokenToBackend - should send token and return success', async () => {
    const fcmToken = 'test-fcm-token';
    const userData = { token: 'auth-token' };
    localStorage.setItem('userData', JSON.stringify(userData));

    const mockResponse = { message: 'Token updated' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await sendTokenToBackend(fcmToken);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/update_device_token'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${userData.token}`,
        }),
        body: JSON.stringify({ device_token: fcmToken }),
      })
    );
  });

  test('sendTokenToBackend - should throw if no userData found', async () => {
    await expect(sendTokenToBackend('token123')).rejects.toThrow(
      'No user data found'
    );
  });

  test('sendTokenToBackend - should throw if no auth token in userData', async () => {
    localStorage.setItem('userData', JSON.stringify({}));
    await expect(sendTokenToBackend('token123')).rejects.toThrow(
      'No authentication token found'
    );
  });
});
