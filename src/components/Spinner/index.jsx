const Spinner = ({ message }) => {
  return (
    <>
      <div className='spinner-border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
      <div className='mt-2'>{message}</div>
    </>
  );
};

export default Spinner;
