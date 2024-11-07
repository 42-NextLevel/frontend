const MatchType = {
  0: '1대1',
  1: '4강전',
  2: '4강전',
  3: '결승전',
};
Object.freeze(MatchType);

export const HistoryTile = ({ history, id }) => {
  return (
    <>
      <div className='accordion-item'>
        <h2 className='accordion-header'>
          <button
            className='accordion-button collapsed'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target={`#${id}`}
            aria-expanded='false'
            aria-controls={id}
          >
            <div className='w-100 d-flex text-center align-items-center'>
              <div className='w-25'>{MatchType[history.matchType]}</div>
              <div className='w-25'>{history.date}</div>
              <div className='w-25'>
                {history.leftNick}vs{history.rightNick}
              </div>
              <div className='w-25'>
                {history.leftScore} : {history.rightScore}
              </div>
            </div>
          </button>
        </h2>
        <div
          id={id}
          className='accordion-collapse collapse'
          data-bs-parent='#HistoryList'
        >
          <div className='accordion-body'>blockchain history</div>
        </div>
      </div>
    </>
  );
};
