const Button = ({
  children,
  onClick,
  disabled = false,
  outline = false,
  noPadding = false,
}) => {
  const styles = {
    btn: true,
    'btn-lg': true,
    'btn-primary': !outline,
    'btn-outline-primary': outline,
    'px-5': !noPadding,
  };
  const className = Object.keys(styles)
    .filter((key) => styles[key])
    .join(' ');

  return (
    <button
      type='button'
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
