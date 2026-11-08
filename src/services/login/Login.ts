import type { LoginRequest, LoginResponse } from '../../types/Login';
import { api } from '../api/api';

export async function Login(login: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api<LoginResponse>('/usuario/login', {
      method: 'POST',
      body: JSON.stringify(login),
    });
    localStorage.setItem('token', response.token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
