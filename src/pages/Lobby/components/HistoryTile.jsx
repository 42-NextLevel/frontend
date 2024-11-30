import { getContractHistory } from '../../../services/contract';
import { useState } from '@/library/hooks.js';

const MatchType = {
  0: '1대1',
  1: '4강전',
  2: '4강전',
  3: '결승전',
  4: '3위 결정전',
};
Object.freeze(MatchType);

export const HistoryTile = ({ history, id }) => {
  const [content, setContent] = useState(null);

  const handleClick = async (gameId) => {
    if (content) {
      return;
    }

    try {
      const res = await getContractHistory(gameId);
      switch (res.status) {
        case 'OK':
          setContent(
            <div
              className='w-100 d-flex text-center align-items-center'
              style='padding-right:20px'
            >
              <div className='w-25'>{MatchType[res.matchType]}</div>
              <div className='w-25'>{res.startTime}</div>
              <div className='w-25'>{`${res.nick1} vs ${res.nick2}`}</div>
              <div className='w-25'>{`${res.score1} : ${res.score2}`}</div>
            </div>,
          );
          break;
        case 'pending':
          setContent(<div className='text-center'>{res.message}</div>);
          break;
        case 'invalid':
          setContent(
            <div className='text-center'>
              There is an error in the transaction record.
            </div>,
          );
          break;
        case 'error':
          setContent(<div className='text-center'>{res.message}</div>);
          break;
        case 'not_found':
          setContent(<div className='text-center'>{res.message}</div>);
          break;
      }
    } catch (e) {
      setContent(
        <div className='text-center'>Error occurred: {e.message}</div>,
      );
    }
  };

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
            onClick={() => {
              handleClick(history.game_id);
            }}
          >
            <div className='w-100 d-flex text-center align-items-center'>
              <div className='w-25'>{MatchType[history.matchType]}</div>
              <div className='w-25'>{history.date}</div>
              <div className='w-25'>
                {history.leftNick} vs {history.rightNick}
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
          <div className='accordion-body bg-body-secondary'>
            {!content ? <div className='text-center'>loading</div> : content}
          </div>
        </div>
      </div>
    </>
  );
};
