import Profile from '@/components/Profile/index';
import RoomCard from './components/RoomCard';
import AddRoundIcon from '/images/add-round.svg';
import RefreshIcon from '/images/refresh.svg';
import { useState } from '@/library/hooks.js';
import ModalTrigger from '@/components/ModalTrigger';
import JoinModal from '@/pages/lobby/components/JoinModal';
import CreateModal from '@/pages/lobby/components/CreateModal';
import { useLoaderData } from '@/library/router/hooks.js';
import { logout } from '@/services/user';
import { getRoomList } from '@/services/game';
import { HistoryList } from '@/pages/lobby/components/HistoryList';

// TODO: 모달 끄면 input 초기화 => 모달 수정

const Lobby = () => {
  const { roomList, userProfile, gameHistory } = useLoaderData();
  const [slicedRoomList, setSlicedRoomList] = useState(roomList);
  const [page, setPage] = useState(1);
  const [isThrottle, setIsThrottle] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState({ name: '', id: '' });

  const handleWheel = (event) => {
    if (!isThrottle) {
      setIsThrottle(true);
      if (event.deltaY > 0) {
        setPage((prevPage) =>
          prevPage < slicedRoomList.length ? prevPage + 1 : 1,
        );
      } else {
        setPage((prevPage) =>
          prevPage > 1 ? prevPage - 1 : slicedRoomList.length,
        );
      }
      setTimeout(() => {
        setIsThrottle(false);
      }, 200);
    }
  };

  const handleJoinRoom = (roomInfo) => {
    setSelectedRoom(roomInfo);
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.status === 200) {
        localStorage.removeItem('access_token');
        window.location.href = '/';
      }
    } catch (err) {
      if (err.response.status === 401) window.location.href = '/';
    }
  };

  return (
    <>
      <div
        className='position-absolute top-50 start-50 translate-middle'
        style='width: 1024px; height: 100%; padding-top: 100px;'
      >
        <div>
          <div className='d-flex justify-content-between col-9 mb-4 pe-3'>
            <h2 className='mb-0'>방 리스트</h2>
            <div>
              <ModalTrigger id='create'>
                <button className='btn btn-primary px-5 py-2 rounded-3 me-3'>
                  <img src={AddRoundIcon} alt='add-round-icon' />
                  <span>방 만들기</span>
                </button>
              </ModalTrigger>
              <button
                className='btn btn-primary p-2 rounded-3'
                onClick={async () => {
                  const roomList = await getRoomList();
                  setSlicedRoomList(roomList);
                  setPage(1);
                }}
              >
                <img src={RefreshIcon} alt='refresh-icon' />
              </button>
            </div>
          </div>
          <div className='row mx-0 gx-0'>
            <div className='col-9' onWheel={handleWheel}>
              <div className='row mx-0' style='height: 294px'>
                {/* 방 리스트 */}
                {slicedRoomList.length === 0 && (
                  <h5 className='col-12 text-center align-self-center text-secondary'>
                    방이 없습니다
                  </h5>
                )}
                {slicedRoomList[page - 1]?.map((roomInfo, index) => (
                  <div
                    key={roomInfo.id}
                    className={`col-6 px-0 pe-3 ${index < 2 ? 'pb-3' : ''}`}
                    onClick={() => handleJoinRoom(roomInfo)}
                  >
                    <ModalTrigger id='join'>
                      <RoomCard {...roomInfo} />
                    </ModalTrigger>
                  </div>
                ))}
              </div>
              <div className='d-flex justify-content-center pe-3 pt-2'>
                {/* 페이지네이션 */}
                {Array.from({ length: slicedRoomList.length }, (_, index) => (
                  <div
                    key={index}
                    className={`mx-1 rounded-circle ${page === index + 1 ? 'bg-primary' : 'border border-primary'}`}
                    style='width: 10px; height: 10px; cursor: pointer;'
                    onClick={() => setPage(index + 1)}
                  />
                ))}
              </div>
            </div>
            <div className='col-3'>
              {/* 프로필 */}
              <Profile
                image={userProfile.profile_image}
                intraId={userProfile.intra_id}
              />
              <button
                type='button'
                className='btn btn-secondary py-2 mt-3 w-100'
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2>경기 기록</h2>
          <HistoryList historyList={gameHistory.history} />
        </div>
      </div>
      <div>
        {/* 게임 생성 모달 */}
        <CreateModal id='create' />
        {/* 게임 참가 모달 */}
        <JoinModal room={selectedRoom} id='join' />
      </div>
    </>
  );
};

export default Lobby;
