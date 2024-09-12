const ModalTrigger = ({ children, id }) => (
  <span data-bs-toggle='modal' data-bs-target={`#${id}`}>
    {children}
  </span>
);

export default ModalTrigger;
