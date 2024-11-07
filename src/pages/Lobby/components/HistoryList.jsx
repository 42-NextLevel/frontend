import { HistoryTile } from './HistoryTile';

export const HistoryList = ({ historyList }) => {
  return (
    <>
      <div
        class='text-center py-3'
        style='padding-left:20px; padding-right:40px'
      >
        <div class='d-flex'>
          <div class='w-25 fs-5'>매치 타입</div>
          <div class='w-25 fs-5'>일자</div>
          <div class='w-25 fs-5'>유저</div>
          <div class='w-25 fs-5'>점수</div>
        </div>
      </div>
      <div class='accordion' id='HistoryList'>
        {historyList?.map((history, key) => (
          <HistoryTile history={history} id={'history' + key} />
        ))}
      </div>
    </>
  );
};
