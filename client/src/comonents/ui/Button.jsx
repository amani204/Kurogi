import { Link } from 'react-router-dom';
import clsx from 'clsx';

const baseStyles =
  'inline-flex items-center justify-center px-8 py-3 font-mono text-sm tracking-widest uppercase transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-shu text-washi hover:bg-shu/90',
  secondary: 'border border-sumi/30 text-sumi hover:border-sumi',
};

/**
 * Usage:
 * <Button variant="primary" onClick={...}>Reserve a Table</Button>
 * <Button variant="secondary" to="/menu">View Menu</Button>   ← renders as a Link
 * <Button variant="primary" type="submit" disabled={loading}>Submit</Button>
 */
const Button = ({
  variant = 'primary',
  to,
  type = 'button',
  disabled = false,
  className,
  children,
  ...rest
}) => {
  const classes = clsx(baseStyles, variants[variant], className);

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;