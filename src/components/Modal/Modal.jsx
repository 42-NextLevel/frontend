const Modal = ({
  children,
  id,
  onClick,
  title = '제목을 넣어주세요',
  btnText = '확인',
}) => {
  return (
    <div
      class='modal fade'
      id={id}
      tabindex='-1'
      aria-labelledby={`${id}ModalLabel`}
      aria-hidden='true'
    >
      <div class='modal-dialog'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h1 class='modal-title fs-5' id={`${id}ModalLabel`}>
              {title}
            </h1>
            <button
              type='button'
              class='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close Modal'
            ></button>
          </div>
          <div class='modal-body'>{children}</div>
          <div class='modal-footer'>
            <button
              type='button'
              class='btn btn-secondary'
              data-bs-dismiss='modal'
              aria-label='Close'
            >
              닫기
            </button>
            {onClick && (
              <button
                type='button'
                class='btn btn-primary'
                // data-bs-dismiss='modal'
                onClick={onClick}
                aria-label='Accept'
              >
                {btnText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
