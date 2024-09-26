const Button = ({ children, onClick, disabled = false }) => {
  return (
    <button
      type='button'
      className='btn btn-lg btn-primary'
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
