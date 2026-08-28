import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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