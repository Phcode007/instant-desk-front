import { SignIn, Ticket } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="bg-slate-800 text-white w-full py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">

        <Link to="/" className="flex items-center gap-2">
          <Ticket size={28} weight="bold" />
          <h1 className="text-xl font-bold">Instant Desk</h1>
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-1 hover:text-blue-300 cursor-pointer transition-colors text-sm"
        >
          <SignIn size={18} weight="bold" />
          <span>Entrar</span>
        </Link>

      </div>
    </div>
  );
}

export default Navbar;