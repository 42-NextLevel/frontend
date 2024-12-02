import ModalTrigger from '@/components/ModalTrigger';
import RoomCard from '@/pages/Lobby/components/RoomCard';

const RoomList = ({ slicedRoomList, page, onJoinRoom }) => {
  if (slicedRoomList.length === 0) {
    return (
      <h5 className='col-12 text-center align-self-center text-secondary'>
        방이 없습니다
      </h5>
    );
  }

  return slicedRoomList[page - 1].map((roomInfo, index) => (
    <div
      key={roomInfo.id}
      className={`col-6 px-0 pe-3 ${index < 2 ? 'pb-3' : ''}`}
      onClick={() => onJoinRoom(roomInfo)}
    >
      <ModalTrigger id='join'>
        <RoomCard {...roomInfo} />
      </ModalTrigger>
    </div>
  ));
};

export default RoomList;
