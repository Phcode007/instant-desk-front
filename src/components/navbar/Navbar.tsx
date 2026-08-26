import { List, SignOut, Ticket } from '@phosphor-icons/react';

function Navbar() {
  return (
    <div className="bg-slate-800 text-white w-full py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Logo / Nome */}
        <div className="flex items-center gap-2">
          <Ticket size={28} weight="bold" />
          <h1 className="text-xl font-bold">Instant Desk</h1>
        </div>

        {/* Links de navegação */}
        <div className="flex items-center gap-6 text-sm">
          <span className="hover:text-slate-300 cursor-pointer transition-colors">
            Dashboard
          </span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">
            Meus Tickets
          </span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">
            Novo Ticket
          </span>
          <div className="flex items-center gap-1 hover:text-red-300 cursor-pointer transition-colors">
            <SignOut size={18} weight="bold" />
            <span>Sair</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Navbar;