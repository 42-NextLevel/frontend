const Button = ({ children, onClick }) => {
  return (
    <button type='button' className='btn btn-indigo' onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
