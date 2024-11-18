const Button = ({
  children,
  onClick,
  color = 'primary',
  disabled = false,
  outline = false,
  noPadding = false,
}) => {
  const styles = ['btn', 'btn-lg'];
  if (!noPadding) {
    styles.push('px-5');
  }
  const buttonStyle = ['btn-'];
  if (outline) {
    buttonStyle.push('outline-');
  }
  buttonStyle.push(color);
  styles.push(buttonStyle.join(''));
  const className = styles.join(' ');

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
