import { Headphones } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen place-items-center">

      {/* Coluna do Formulário */}
      <form className="flex justify-center items-center flex-col w-2/3 gap-3">
        <h2 className="text-5xl font-bold text-slate-900">Entrar</h2>

        <div className="flex flex-col w-full">
          <label htmlFor="usuario" className="text-xl text-slate-900">Usuário (e-mail)</label>
          <input
            type="email"
            id="usuario"
            name="usuario"
            placeholder="seuemail@empresa.com"
            className="border-2 border-slate-700 rounded p-2"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="senha" className="text-xl text-slate-900">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Sua senha"
            className="border-2 border-slate-700 rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="rounded text-white bg-indigo-400 hover:bg-indigo-900 w-full py-2 mt-2"
        >
          Entrar
        </button>

        <hr className="border-slate-400 w-full" />

        <p className="text-slate-900">
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="text-indigo-800 font-bold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>

      {/* Coluna do Painel Lateral (some no mobile) */}
      <div className="hidden lg:flex bg-slate-800 min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <Headphones size={80} weight="bold" className="text-blue-400" />
          <p className="text-2xl font-bold">Instant Desk</p>
          <p className="text-slate-300 text-center max-w-xs px-4">
            Acesse sua conta para acompanhar os chamados da sua equipe.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;