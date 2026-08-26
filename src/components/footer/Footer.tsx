import { GithubLogo, LinkedinLogo, Envelope } from '@phosphor-icons/react';

function Footer() {
  const data = new Date().getFullYear();

  return (
    <div className="bg-slate-800 text-white w-full py-6 mt-8">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2">
        
        <p className="text-lg font-bold">Instant Desk</p>
        
        <p className="text-sm text-slate-300">
          © {data} - Sistema de Help Desk. Todos os direitos reservados.
        </p>

        <div className="flex gap-4 mt-2">
          <a 
            href="https://github.com/Phcode007" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            <GithubLogo size={28} weight="bold" />
          </a>
          <a 
            href="#" 
            className="hover:text-slate-300 transition-colors"
          >
            <LinkedinLogo size={28} weight="bold" />
          </a>
          <a 
            href="#" 
            className="hover:text-slate-300 transition-colors"
          >
            <Envelope size={28} weight="bold" />
          </a>
        </div>

      </div>
    </div>
  );
}

export default Footer;