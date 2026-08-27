import { SignIn } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Navbar() {
  return (
    <div className="bg-slate-800 w-full py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">

        <Link to="/">
          <img src={logo} alt="Instant Desk" className="h-8 w-auto" />
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-1 text-white hover:text-blue-300 cursor-pointer transition-colors text-sm"
        >
          <SignIn size={18} weight="bold" />
          <span>Entrar</span>
        </Link>

      </div>
    </div>
  );
}

export default Navbar;