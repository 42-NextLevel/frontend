const Button = ({ children, onClick }) => {
  return (
    <button type='button' className='btn btn-outline-primary' onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
