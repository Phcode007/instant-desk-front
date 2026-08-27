import { ArrowRight, ShieldCheck, Lightning, Users } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import icon from '../../assets/icon.png';

function Landing() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100">

        {/* HERO SECTION */}
        <div className="bg-slate-800 text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img src={icon} alt="Instant Desk" className="h-16 w-auto mx-auto" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Instant Desk
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
              O sistema de Help Desk que conecta sua equipe e resolve problemas em tempo recorde.
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors flex items-center gap-2 mx-auto w-fit"
            >
              Acessar o Sistema
              <ArrowRight size={24} weight="bold" />
            </Link>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Por que usar o Instant Desk?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Lightning size={40} weight="bold" className="text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Rápido</h3>
              <p className="text-slate-600">
                Abra e acompanhe tickets em segundos. Notificações em tempo real para sua equipe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <ShieldCheck size={40} weight="bold" className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Seguro</h3>
              <p className="text-slate-600">
                Isolamento completo de dados por empresa. Autenticação JWT e controle de acesso.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Users size={40} weight="bold" className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Colaborativo</h3>
              <p className="text-slate-600">
                Comunicação por chat em cada ticket. Anexos, comentários e histórico completo.
              </p>
            </div>

          </div>
        </div>

        {/* CTA SECTION */}
        <div className="bg-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Pronto para organizar seu suporte?
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Junte-se às empresas que já utilizam o Instant Desk para gerenciar chamados de forma eficiente.
            </p>
            <Link
              to="/login"
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors inline-block"
            >
              Começar Agora
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default Landing;