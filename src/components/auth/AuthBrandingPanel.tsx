import { SealCheck, Ticket, UsersThree, ShieldCheck } from '@phosphor-icons/react';
import icon from '../../assets/icon.png';

function AuthBrandingPanel() {
  return (
    <div className="lg:w-1/2 bg-primary text-on-primary p-gutter lg:p-xl xl:p-16 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-fixed/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex items-center gap-sm">
        <img src={icon} alt="Instant Desk" className="h-9 w-auto" />
        <span className="font-headline-md text-headline-md tracking-tight text-on-primary">Instant Desk</span>
      </div>

      <div className="relative z-10 my-16 max-w-lg">
        <div className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-primary-container/60 text-inverse-primary font-label-sm mb-md">
          <SealCheck size={16} weight="bold" />
          Plataforma de Suporte Empresarial
        </div>

        <h1 className="font-headline-xl text-headline-xl mb-md text-on-primary leading-tight">
          Organize o suporte da sua equipe em um só lugar.
        </h1>
        <p className="font-body-lg text-body-lg text-inverse-primary/90 mb-xl">
          Centralize chamados, prioridades e conversas de suporte técnico em uma única plataforma.
        </p>

        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-sm">
            <Ticket size={22} weight="bold" className="text-inverse-primary" />
            <span className="font-body-md text-body-md text-inverse-primary/90">Tickets centralizados por categoria e prioridade</span>
          </div>
          <div className="flex items-center gap-sm">
            <UsersThree size={22} weight="bold" className="text-inverse-primary" />
            <span className="font-body-md text-body-md text-inverse-primary/90">Comentários e colaboração em equipe</span>
          </div>
          <div className="flex items-center gap-sm">
            <ShieldCheck size={22} weight="bold" className="text-inverse-primary" />
            <span className="font-body-md text-body-md text-inverse-primary/90">Isolamento completo entre empresas</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 font-body-sm text-inverse-primary/70">
        © {new Date().getFullYear()} Instant Desk
      </div>
    </div>
  );
}

export default AuthBrandingPanel;