import { useEffect, useState, type FormEvent } from 'react';
import type Company from '../../models/Company';
import { api, getApiErrorMessage } from '../../services/Service';
import AppNavbar from '../../components/navbar/AppNavbar';
import { Button, LoadingState, useToast } from '../../components/ui';

function CompanySettings() {
  const { showToast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api.get<Company[]>('/companies')
      .then(({ data }) => {
        if (active) setCompany(data[0] ?? null);
      })
      .catch((error: unknown) => {
        if (active) setErro(getApiErrorMessage(error, 'Não foi possível carregar os dados da empresa.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!company) return;

    setIsSaving(true);
    try {
      const { data } = await api.put<Company>('/companies', {
        id: company.id,
        nome: company.nome,
        cnpj: company.cnpj,
      });
      setCompany(data);
      showToast({ title: 'Configurações salvas', description: 'Os dados da empresa foram atualizados.', variant: 'success' });
    } catch (error) {
      showToast({
        title: 'Não foi possível salvar',
        description: getApiErrorMessage(error, 'Tente novamente.'),
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background pt-header-height">
        <div className="mx-auto w-full max-w-3xl space-y-6 px-lg py-xl">
          <header>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Configurações da empresa</h1>
            <p className="mt-2 text-sm text-on-surface-variant">Gerencie os dados da empresa vinculada à sua conta.</p>
          </header>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            {isLoading ? (
              <LoadingState variant="skeleton" label="Carregando configurações" lines={2} />
            ) : erro ? (
              <p role="alert" className="text-sm text-red-700">{erro}</p>
            ) : !company ? (
              <p role="alert" className="text-sm text-slate-600">Nenhuma empresa vinculada foi encontrada.</p>
            ) : (
              <form className="space-y-5" onSubmit={(event) => void salvar(event)}>
                <label className="block space-y-1 text-sm font-medium text-slate-700" htmlFor="company-name">
                  Nome da empresa
                  <input
                    id="company-name"
                    required
                    value={company.nome}
                    onChange={(event) => setCompany({ ...company, nome: event.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  />
                </label>
                {company.cnpj && (
                  <p className="text-sm text-slate-600">CNPJ: {company.cnpj}</p>
                )}
                <div className="flex justify-end">
                  <Button type="submit" loading={isSaving}>Salvar alterações</Button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default CompanySettings;
