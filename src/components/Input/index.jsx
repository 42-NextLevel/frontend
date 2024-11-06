const Input = ({ placeholder, onChange, label, value, type = 'text' }) => {
  return (
    <>
      {label && (
        <label className='form-label mt-3' htmlFor={label}>
          {label}
        </label>
      )}
      <input
        id={label}
        type={type}
        className='form-control form-control-lg fs-6'
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </>
  );
};

export default Input;
