import { cn } from '../../lib/utils';
import { useAdminLang } from '../../i18n/index-admin';

const LanguageSwitcher = ({ variant = 'default', className }) => {
  const { lang, setLang } = useAdminLang();

  const variants = {
    default: {
      wrapper: 'flex items-center gap-1 border border-gin',
      button: 'px-3 py-1.5 text-[0.5rem] tracking-[0.15em] transition-colors',
      active: 'bg-sumi text-washi',
      inactive: 'text-muted-foreground hover:bg-sumi/5 hover:text-sumi',
    },
    login: {
      wrapper: 'flex items-center gap-1 border border-gin/20',
      button: 'px-3 py-1.5 text-[0.5rem] tracking-[0.15em] transition-colors',
      active: 'bg-sumi text-washi',
      inactive: 'text-muted-foreground/50 hover:text-washi',
    },
    minimal: {
      wrapper: 'flex items-center gap-0.5',
      button: 'px-2 py-1 text-[0.45rem] tracking-[0.15em] transition-colors uppercase',
      active: 'text-sumi font-medium',
      inactive: 'text-muted-foreground hover:text-sumi/70',
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={cn(currentVariant.wrapper, className)}>
      {['en', 'fr', 'ar'].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            currentVariant.button,
            lang === l ? currentVariant.active : currentVariant.inactive
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;