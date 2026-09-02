import { Globe, ShareNetwork, Share } from '@phosphor-icons/react';
import { useLanguageStore } from '../../store/useLanguageStore';
import logo from '../../assets/logo.png';

function Footer() {
  const { t } = useLanguageStore();
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface-container-low py-xl border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl mb-xl">
          <div>
            <div className="flex items-center gap-xs mb-md">
              <img src={logo} alt="Instant Desk" className="h-6 w-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-md">{t.footer.product}</h4>
            <ul className="space-y-sm">
              <li className="font-body-sm text-body-sm text-on-surface-variant">{t.nav.features}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-md">{t.footer.company}</h4>
            <ul className="space-y-sm">
              <li className="font-body-sm text-body-sm text-on-surface-variant">Instant Desk</li>
            </ul>
          </div>

          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-md">{t.footer.social}</h4>
            <div className="flex gap-md">
              <Globe className="text-on-surface-variant hover:text-primary cursor-pointer" size={20} />
              <ShareNetwork className="text-on-surface-variant hover:text-primary cursor-pointer" size={20} />
              <Share className="text-on-surface-variant hover:text-primary cursor-pointer" size={20} />
            </div>
          </div>
        </div>

        <div className="pt-md border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-sm">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            © {anoAtual} Instant Desk. {t.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;