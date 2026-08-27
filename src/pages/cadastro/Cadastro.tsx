import { Headphones } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

function Cadastro() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen place-items-center">

      <form className="flex justify-center items-center flex-col w-2/3 gap-3">
        <h2 className="text-5xl font-bold text-slate-900">Cadastrar</h2>

        <div className="flex flex-col w-full">
          <label htmlFor="nome" className="text-xl text-slate-900">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Nome completo"
            className="border-2 border-slate-700 rounded p-2"
          />
        </div>

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
            placeholder="Mínimo 8 caracteres"
            className="border-2 border-slate-700 rounded p-2"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="confirmarSenha" className="text-xl text-slate-900">Confirmar Senha</label>
          <input
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            placeholder="Repita a senha"
            className="border-2 border-slate-700 rounded p-2"
          />
        </div>

        <div className="flex justify-around w-full gap-8 mt-2">
          <Link
            to="/login"
            className="rounded text-white bg-red-400 hover:bg-red-700 w-1/2 py-2 text-center"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="rounded text-white bg-indigo-400 hover:bg-indigo-900 w-1/2 py-2"
          >
            Cadastrar
          </button>
        </div>
      </form>

      <div className="hidden lg:flex bg-slate-800 min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <Headphones size={80} weight="bold" className="text-blue-400" />
          <p className="text-2xl font-bold">Instant Desk</p>
          <p className="text-slate-300 text-center max-w-xs px-4">
            Crie sua conta e comece a organizar o suporte da sua equipe.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Cadastro;