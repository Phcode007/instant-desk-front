import {
  SealCheck,
  ArrowRight,
  PlayCircle,
  Ticket,
  UsersThree,
  ChartBar,
  Timer,
  Lightning,
  FolderSimple,
  TrendUp,
  Quotes,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { useLanguageStore } from '../../store/useLanguageStore';

function Landing() {
  const { t } = useLanguageStore();

  return (
    <>
      <Navbar />
      <main className="w-full pt-header-height bg-surface">
        <div className="flex flex-col w-full">

          {/* Hero Section */}
          <section className="relative w-full bg-surface pt-xl pb-32 overflow-hidden flex flex-col md:flex-row items-center px-gutter max-w-7xl mx-auto gap-xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="w-full md:w-1/2 flex flex-col items-start z-10">
              <div className="inline-flex items-center gap-sm bg-primary/10 px-md py-xs rounded-full mb-lg">
                <SealCheck size={18} weight="bold" className="text-primary" />
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                  {t.hero.badge}
                </span>
              </div>

              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-md">
                {t.hero.title} <br />
                <span className="text-primary">{t.hero.titleHighlight}</span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[480px]">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-md">
                <Link
                  to="/cadastro"
                  className="bg-primary text-on-primary px-xl py-md rounded-full font-label-md text-label-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-xs"
                >
                  {t.hero.ctaPrimary}
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <button className="bg-surface-container text-on-surface px-xl py-md rounded-full font-label-md text-label-md shadow-sm hover:bg-surface-variant transition-all flex items-center justify-center gap-xs">
                  {t.hero.ctaSecondary}
                  <PlayCircle size={18} weight="bold" />
                </button>
              </div>

              <p className="mt-lg font-body-sm text-body-sm text-on-surface-variant">
                {t.hero.trustedBy}
              </p>
            </div>

            {/* TODO: substituir por screenshot real do produto quando tivermos uma tela pronta */}
            <div className="w-full md:w-1/2 z-10 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem] blur-xl -z-10" />
              <div className="w-full aspect-[4/3] rounded-[1.5rem] shadow-xl border border-outline-variant/30 bg-primary flex items-center justify-center">
                <Ticket size={96} weight="light" className="text-on-primary/40" />
              </div>
            </div>
          </section>

          {/* Trusted By Section */}
          <section className="w-full bg-surface-container-low py-xl">
            <div className="max-w-7xl mx-auto px-gutter text-center">
              <p className="font-label-md text-label-md text-on-surface-variant mb-lg uppercase tracking-widest">
                {t.hero.trustedBy}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-xl opacity-40 grayscale">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className="font-headline-md text-headline-md text-on-background">
                    {t.logos.placeholder}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section id="features" className="w-full bg-surface py-32 relative">
            <div className="max-w-7xl mx-auto px-gutter">
              <div className="text-center mb-24">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">
                  {t.features.title}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                  {t.features.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-lg">
                    <Ticket size={28} weight="bold" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">{t.features.f1title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{t.features.f1desc}</p>
                </div>

                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm hover:shadow-md transition-all md:mt-12">
                  <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-lg">
                    <UsersThree size={28} weight="bold" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">{t.features.f2title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{t.features.f2desc}</p>
                </div>

                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-14 h-14 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-lg">
                    <FolderSimple size={28} weight="bold" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">{t.features.f3title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{t.features.f3desc}</p>
                </div>

                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm hover:shadow-md transition-all md:mt-12">
                  <div className="w-14 h-14 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center mb-lg">
                    <ChartBar size={28} weight="bold" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">{t.features.f4title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{t.features.f4desc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="w-full bg-inverse-surface py-32">
            <div className="max-w-7xl mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute -inset-10 bg-gradient-to-r from-primary-container to-tertiary-container blur-3xl opacity-30 rounded-full -z-10" />
                <div className="w-full aspect-square rounded-[24px] shadow-xl bg-tertiary flex items-center justify-center">
                  <TrendUp size={96} weight="light" className="text-inverse-primary/60" />
                </div>
              </div>

              <div className="order-1 md:order-2 flex flex-col gap-lg z-10 text-on-tertiary">
                <h2 className="font-headline-lg text-headline-lg mb-sm">{t.benefits.title}</h2>
                <div className="flex flex-col gap-xl mt-md">
                  <div className="flex gap-md">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mt-xs">
                      <Lightning size={22} weight="bold" className="text-inverse-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm mb-xs">{t.benefits.b1title}</h4>
                      <p className="font-body-md text-body-md text-on-tertiary/70">{t.benefits.b1desc}</p>
                    </div>
                  </div>

                  <div className="flex gap-md">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mt-xs">
                      <FolderSimple size={22} weight="bold" className="text-inverse-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm mb-xs">{t.benefits.b2title}</h4>
                      <p className="font-body-md text-body-md text-on-tertiary/70">{t.benefits.b2desc}</p>
                    </div>
                  </div>

                  <div className="flex gap-md">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mt-xs">
                      <Timer size={22} weight="bold" className="text-inverse-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm mb-xs">{t.benefits.b3title}</h4>
                      <p className="font-body-md text-body-md text-on-tertiary/70">{t.benefits.b3desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section (placeholder, sem nome/foto fabricados) */}
          <section className="w-full bg-surface-container py-24">
            <div className="max-w-4xl mx-auto px-gutter text-center relative">
              <Quotes size={64} weight="fill" className="text-primary/10 absolute -top-8 left-1/2 -translate-x-1/2" />
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xl relative z-10 italic font-normal">
                "{t.testimonial.quote}"
              </h3>
              <p className="font-label-md text-label-md text-on-surface-variant">{t.testimonial.author}</p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="w-full bg-primary text-on-primary py-32 relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-gutter text-center relative z-10 flex flex-col items-center">
              <h2 className="font-headline-xl text-headline-xl mb-md">{t.cta.title}</h2>
              <p className="font-body-lg text-body-lg text-primary-fixed-dim mb-xl max-w-xl">{t.cta.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-md justify-center w-full sm:w-auto">
                <Link
                  to="/cadastro"
                  className="bg-surface text-primary px-xl py-md rounded-full font-label-md text-label-md shadow-lg hover:bg-surface-container-lowest transition-all"
                >
                  {t.cta.primary}
                </Link>
              </div>
              <p className="font-label-sm text-label-sm text-primary-fixed-dim mt-lg">{t.cta.note}</p>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default Landing;