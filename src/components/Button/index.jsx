const Button = ({ children, onClick }) => {
  return (
    <button type='button' className='btn btn-lg btn-primary' onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
