import { HistoryTile } from './HistoryTile';

export const HistoryList = ({ historyList }) => {
  if (historyList.length === 0) {
    return (
      <h5 className='text-center text-secondary mt-6'>경기 기록이 없습니다</h5>
    );
  }

  return (
    <>
      <div
        className='text-center py-3'
        style='padding-left:20px; padding-right:40px'
      >
        <div className='d-flex'>
          <div className='w-25 fs-5'>매치 타입</div>
          <div className='w-25 fs-5'>일자</div>
          <div className='w-25 fs-5'>유저</div>
          <div className='w-25 fs-5'>점수</div>
        </div>
      </div>
      <div className='accordion' id='HistoryList'>
        {historyList.map((history, key) => (
          <HistoryTile history={history} id={'history' + key} />
        ))}
      </div>
    </>
  );
};
