import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User as UserIcon,
  EnvelopeSimple,
  Lock,
  Buildings,
  IdentificationCard,
  ArrowRight,
  Eye,
  EyeSlash,
  CircleNotch,
} from '@phosphor-icons/react';
import { cadastrarUsuario } from '../../services/Service';
import type User from '../../models/User';
import AuthBrandingPanel from '../../components/auth/AuthBrandingPanel';

interface DadosCadastro {
  nome: string;
  usuario: string;
  senha: string;
  nomeEmpresa: string;
  cnpj: string;
}

function formatarCnpj(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 14);
  return digitos
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function Cadastro() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [aceitouTermos, setAceitouTermos] = useState<boolean>(false);
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState<boolean>(false);

  const [dadosCadastro, setDadosCadastro] = useState<DadosCadastro>({
    nome: '',
    usuario: '',
    senha: '',
    nomeEmpresa: '',
    cnpj: '',
  });

  const [usuarioCriado, setUsuarioCriado] = useState<User>({
    id: 0,
    nome: '',
    usuario: '',
    senha: '',
  });

  useEffect(() => {
    if (usuarioCriado.id !== 0) {
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    }
  }, [usuarioCriado]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setDadosCadastro({
      ...dadosCadastro,
      [e.target.name]: e.target.value,
    });
  }

  function atualizarCnpj(e: ChangeEvent<HTMLInputElement>) {
    setDadosCadastro({
      ...dadosCadastro,
      cnpj: formatarCnpj(e.target.value),
    });
  }

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!aceitouTermos) {
      alert('Você precisa aceitar os termos de uso para continuar.');
      return;
    }

    if (dadosCadastro.senha.length < 8) {
      alert('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (dadosCadastro.senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      setDadosCadastro({ ...dadosCadastro, senha: '' });
      setConfirmarSenha('');
      return;
    }

    setIsLoading(true);

    try {
      await cadastrarUsuario<User>('/users/registrar', dadosCadastro, setUsuarioCriado);
    } catch {
      alert('Erro ao criar a conta. Confira os dados e tente novamente.');
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      <AuthBrandingPanel />

      {/* Coluna direita — Formulário */}
      <div className="lg:w-1/2 bg-surface flex items-center justify-center p-gutter lg:p-xl">
        <div className="w-full max-w-md bg-surface-container-lowest p-xl rounded-xl shadow-sm">

          <div className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Criar sua conta</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Preencha seus dados para começar.</p>
          </div>

          <form onSubmit={cadastrarNovoUsuario} className="space-y-lg">

            <div className="space-y-md">
              <div className="font-label-md text-primary uppercase tracking-wider text-[12px]">Seus dados</div>

              <div className="space-y-xs">
                <label htmlFor="nome" className="block font-label-md text-on-surface">Nome completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                    <UserIcon size={20} />
                  </span>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={dadosCadastro.nome}
                    onChange={atualizarEstado}
                    placeholder="Seu nome completo"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-md py-md bg-surface-container-low text-on-surface rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label htmlFor="usuario" className="block font-label-md text-on-surface">E-mail</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                    <EnvelopeSimple size={20} />
                  </span>
                  <input
                    type="email"
                    id="usuario"
                    name="usuario"
                    value={dadosCadastro.usuario}
                    onChange={atualizarEstado}
                    placeholder="nome@empresa.com"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-md py-md bg-surface-container-low text-on-surface rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label htmlFor="senha" className="block font-label-md text-on-surface">Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                    <Lock size={20} />
                  </span>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    id="senha"
                    name="senha"
                    value={dadosCadastro.senha}
                    onChange={atualizarEstado}
                    placeholder="Mínimo 8 caracteres"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-md bg-surface-container-low text-on-surface rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute inset-y-0 right-0 pr-md flex items-center text-on-surface-variant"
                  >
                    {mostrarSenha ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-xs">
                <label htmlFor="confirmar-senha" className="block font-label-md text-on-surface">Confirmar senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                    <Lock size={20} />
                  </span>
                  <input
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    id="confirmar-senha"
                    name="confirmarSenha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-md bg-surface-container-low text-on-surface rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                    className="absolute inset-y-0 right-0 pr-md flex items-center text-on-surface-variant"
                  >
                    {mostrarConfirmarSenha ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-md pt-md">
              <div className="font-label-md text-primary uppercase tracking-wider text-[12px]">Dados da empresa</div>

              <div className="space-y-xs">
                <label htmlFor="nomeEmpresa" className="block font-label-md text-on-surface">Nome da empresa</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                    <Buildings size={20} />
                  </span>
                  <input
                    type="text"
                    id="nomeEmpresa"
                    name="nomeEmpresa"
                    value={dadosCadastro.nomeEmpresa}
                    onChange={atualizarEstado}
                    placeholder="Nome da sua organização"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-md py-md bg-surface-container-low text-on-surface rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label htmlFor="cnpj" className="block font-label-md text-on-surface">CNPJ</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                    <IdentificationCard size={20} />
                  </span>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={dadosCadastro.cnpj}
                    onChange={atualizarCnpj}
                    placeholder="00.000.000/0000-00"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-md py-md bg-surface-container-low text-on-surface rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md disabled:opacity-50"
                  />
                </div>
              </div>

              <p className="font-body-sm text-[12px] text-on-surface-variant/80">
                Se sua empresa já estiver cadastrada, você será adicionado a ela automaticamente.
              </p>
            </div>

            <label className="flex items-start gap-sm cursor-pointer">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                disabled={isLoading}
                className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Li e aceito os{' '}
                <span className="text-primary hover:underline">Termos de Uso</span> e a{' '}
                <span className="text-primary hover:underline">Política de Privacidade</span>.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-md px-xl bg-primary text-on-primary rounded-full font-label-md text-label-md shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-sm disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <CircleNotch size={20} className="animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowRight size={18} weight="bold" />
                </>
              )}
            </button>
          </form>

          <div className="text-center font-body-sm text-on-surface-variant mt-xl">
            Já possui uma conta?{' '}
            <Link to="/login" className="font-label-md text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;