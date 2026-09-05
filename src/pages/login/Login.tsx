import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  ArrowRight,
  CircleNotch,
  WarningCircle,
  Warning,
} from '@phosphor-icons/react';
import { login } from '../../services/Service';
import type UsuarioLogin from '../../models/UsuarioLogin';
import { useAuthStore } from '../../store/useAuthStore';
import AuthBrandingPanel from '../../components/auth/AuthBrandingPanel';

interface DadosLogin {
  usuario: string;
  senha: string;
}

function Login() {
  const navigate = useNavigate();
  const { login: autenticar } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [erroEmailFormato, setErroEmailFormato] = useState<boolean>(false);
  const [erroAutenticacao, setErroAutenticacao] = useState<string | null>(null);
  const [lembrarDeMim, setLembrarDeMim] = useState<boolean>(true);

  const [dadosLogin, setDadosLogin] = useState<DadosLogin>({
    usuario: '',
    senha: '',
  });

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setDadosLogin({
      ...dadosLogin,
      [e.target.name]: e.target.value,
    });
  }

  async function autenticarUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroAutenticacao(null);

    const emailValido = /\S+@\S+\.\S+/.test(dadosLogin.usuario);
    if (!emailValido) {
      setErroEmailFormato(true);
      return;
    }
    setErroEmailFormato(false);
    setIsLoading(true);

    try {
      await login<UsuarioLogin>('/users/logar', dadosLogin, (dadosRecebidos) => {
        autenticar(dadosRecebidos);
        navigate('/');
      });
    } catch {
      // Mensagem genérica de propósito: não revela se o problema foi
      // o e-mail (não existe) ou a senha (está errada) — boa prática
      // de segurança, evita dar pista pra quem tenta adivinhar credenciais.
      setErroAutenticacao('E-mail ou senha incorretos. Tente novamente.');
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AuthBrandingPanel />

      <div className="lg:w-1/2 bg-surface flex items-center justify-center p-gutter lg:p-xl">
        <div className="w-full max-w-md bg-surface-container-lowest p-xl rounded-xl shadow-sm">

          <div className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Entrar</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Acesse sua conta para continuar.</p>
          </div>

          {erroAutenticacao && (
            <div className="mb-xl p-md rounded-xl bg-error-container text-on-error-container flex items-start gap-md shadow-sm">
              <WarningCircle size={20} weight="fill" className="mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-label-md">Credenciais inválidas</div>
                <div className="font-body-sm">{erroAutenticacao}</div>
              </div>
            </div>
          )}

          <form onSubmit={autenticarUsuario} className="space-y-lg">

            <div className="space-y-xs">
              <label htmlFor="usuario" className="block font-label-md text-on-surface">E-mail corporativo</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                  <EnvelopeSimple size={20} />
                </span>
                <input
                  type="email"
                  id="usuario"
                  name="usuario"
                  value={dadosLogin.usuario}
                  onChange={atualizarEstado}
                  placeholder="nome@empresa.com"
                  required
                  disabled={isLoading}
                  className={`w-full pl-12 pr-md py-md bg-surface-container-low text-on-surface rounded-xl border ${
                    erroEmailFormato ? 'border-error' : 'border-outline-variant'
                  } focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md disabled:opacity-50`}
                />
              </div>
              {erroEmailFormato && (
                <span className="font-label-sm text-error flex items-center gap-xs mt-xs">
                  <Warning size={14} weight="fill" />
                  Verifique o formato do e-mail digitado.
                </span>
              )}
            </div>

            <div className="space-y-xs">
              <div className="flex justify-between items-center">
                <label htmlFor="senha" className="block font-label-md text-on-surface">Senha</label>
                <span className="font-label-sm text-primary hover:underline cursor-pointer">Esqueci minha senha</span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                  <Lock size={20} />
                </span>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  id="senha"
                  name="senha"
                  value={dadosLogin.senha}
                  onChange={atualizarEstado}
                  placeholder="Sua senha"
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-md bg-surface-container-low text-on-surface rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label="Mostrar ou ocultar senha"
                  className="absolute inset-y-0 right-0 pr-md flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {mostrarSenha ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lembrarDeMim}
                onChange={(e) => setLembrarDeMim(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
              />
              <span className="font-body-sm text-on-surface-variant">Lembrar de mim por 30 dias</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-md px-xl bg-primary text-on-primary rounded-full font-label-md text-label-md shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-sm disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <CircleNotch size={20} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight size={18} weight="bold" />
                </>
              )}
            </button>
          </form>

          <div className="text-center font-body-sm text-on-surface-variant mt-xl">
            Ainda não possui uma conta?{' '}
            <Link to="/cadastro" className="font-label-md text-primary hover:underline">
              Criar conta empresarial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;