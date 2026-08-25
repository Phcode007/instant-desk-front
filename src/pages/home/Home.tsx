
function Home() {
  return (
    <>
      {/* Header / Navbar */}
      <div className="bg-slate-800 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Instant Desk</h1>
          <span className="text-sm text-slate-300">Sistema de Help Desk</span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Boas-vindas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800">Bem-vindo ao Dashboard</h2>
          <p className="text-slate-600 mt-1">Acompanhe seus tickets de suporte em um só lugar.</p>
        </div>

        {/* Cards de resumo (equivalente aos cards de postagem do Blog Pessoal) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-slate-700">Abertos</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">12</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-slate-700">Em Atendimento</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">5</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-slate-700">Resolvidos</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">28</p>
          </div>
        </div>

        {/* Lista de tickets fictícia (equivalente às postagens do Blog) */}
        <h3 className="text-lg font-bold text-slate-800 mb-4">Últimos Tickets</h3>
        
        <div className="space-y-4">
          {/* Ticket 1 */}
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800">Erro ao acessar o sistema de vendas</h4>
                <p className="text-slate-600 mt-1 text-sm">Não consigo fazer login no módulo de vendas desde ontem...</p>
              </div>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">ABERTO</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Aberto por: Carlos Silva | Categoria: Sistemas | 25/08/2026
            </div>
          </div>

          {/* Ticket 2 */}
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800">Solicitação de novo mouse</h4>
                <p className="text-slate-600 mt-1 text-sm">O mouse atual parou de funcionar, preciso de um substituto urgente.</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">EM ANDAMENTO</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Aberto por: Ana Paula | Categoria: Hardware | 24/08/2026
            </div>
          </div>

          {/* Ticket 3 */}
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800">Dúvida sobre férias coletivas</h4>
                <p className="text-slate-600 mt-1 text-sm">Gostaria de saber como funciona o agendamento neste ano.</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">RESOLVIDO</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Aberto por: João Mendes | Categoria: RH | 20/08/2026
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Home;