import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 45000, 
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().usuario?.token;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const cadastrarUsuario = async <T>(
  url: string,
  dados: object,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.post<T>(url, dados);
  setDados(resposta.data);
};

export const login = async <T>(
  url: string,
  dados: object,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.post<T>(url, dados);
  setDados(resposta.data);
};

export const buscar = async <T>(
  url: string,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.get<T>(url);
  setDados(resposta.data);
};

export const enviar = async <T>(
  url: string,
  dados: object,
  setDados: (dado: T) => void,
) => {
  const resposta = await api.post<T>(url, dados);
  setDados(resposta.data);
};
