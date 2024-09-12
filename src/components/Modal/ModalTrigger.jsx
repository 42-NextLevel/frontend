const ModalTrigger = ({ children, id }) => (
  <div data-bs-toggle='modal' data-bs-target={`#${id}`}>
    {children}
  </div>
);

export default ModalTrigger;
