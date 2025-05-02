// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.107:8070/auth/login'; // Altere conforme necessário

interface LoginPayload {
  login: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

class AuthService {
  // Função para realizar o login e salvar o token no AsyncStorage
  static async login({ login, password }: LoginPayload): Promise<AuthResponse | null> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao fazer login');
      }

      const data: AuthResponse = await response.json();
      
      // Salva o token no AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Função para obter o token salvo no AsyncStorage
  static async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }

  // Função para remover o token no logout
  static async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
  }
}

export default AuthService;
