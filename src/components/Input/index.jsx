const Input = ({ placeholder, onChange, label }) => {
  return (
    <>
      {label && (
        <label className='form-label mt-3' htmlFor={label}>
          {label}
        </label>
      )}
      <input
        id={label}
        type='text'
        className='form-control form-control-lg fs-6'
        placeholder={placeholder}
        onChange={onChange}
      />
    </>
  );
};

export default Input;
