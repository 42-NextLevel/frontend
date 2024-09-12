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
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div class='modal-dialog'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h1 class='modal-title fs-5' id='exampleModalLabel'>
              {title}
            </h1>
            <button
              type='button'
              class='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div class='modal-body'>{children}</div>
          <div class='modal-footer'>
            <button
              type='button'
              class='btn btn-secondary'
              data-bs-dismiss='modal'
            >
              닫기
            </button>
            {onClick && (
              <button
                type='button'
                class='btn btn-primary'
                // data-bs-dismiss='modal'
                onClick={onClick}
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