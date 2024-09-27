import Profile from '@/components/Profile/index';
import RoomCard from './components/RoomCard';
import AddRoundIcon from '/images/add-round.svg';
import RefreshIcon from '/images/refresh.svg';
import { getRoomList } from '../../services/game';
import { getUserProfile } from '../../services/user';
import { useState, useEffect } from '@/library/hooks.js';
import { getTestRoomList, getTestUserProfile } from '../../services/test';

const Lobby = () => {
  const [roomList, setRoomList] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [page, setPage] = useState(1);
  const [isPointerOver, setIsPointerOver] = useState(false);

  const fetchRoomList = async () => {
    // const response = [...(await getRoomList())];
    const response = [...(await getTestRoomList())];
    const slicedResponse = [];

    for (let i = 0; i < response.length; i += 4) {
      const chunk = response.slice(i, i + 4);
      slicedResponse.push(chunk);
    }

    setRoomList(slicedResponse);
    setPage(1);
  };

  const fetchUserProfile = async () => {
    // const response = await getUserProfile();
    const response = await getTestUserProfile();
    setUserProfile(response);
  };

  useEffect(async () => {
    fetchRoomList();
    fetchUserProfile();
  }, []);

  const handleMouseEnter = () => {
    setIsPointerOver(true);
    console.log('포인터가 요소 위에 있습니다.');
  };

  const handleMouseLeave = () => {
    setIsPointerOver(false);
    console.log('포인터가 요소를 벗어났습니다.');
  };

  const handleWheel = () => {
    if (isPointerOver) {
      console.log('마우스 휠 이벤트 발생');
      setPage((prevPage) => (prevPage < roomList.length ? prevPage + 1 : 1));
    }
  };

  return (
    <div
      className='position-absolute top-50 start-50 translate-middle'
      style='width: 1024px; height: 100%;'
    >
      <div>
        <div className='d-flex justify-content-between col-9 mb-4 pe-3'>
          <h2 className='mb-0'>방 리스트</h2>
          <div>
            <button className='btn btn-primary px-5 py-2 rounded-3 me-3'>
              <img src={AddRoundIcon} alt='add-round-icon' />
              <span>방 만들기</span>
            </button>
            <button
              className='btn btn-primary p-2 rounded-3'
              onClick={fetchRoomList}
            >
              <img src={RefreshIcon} alt='refresh-icon' />
            </button>
          </div>
        </div>
        <div className='row mx-0 gx-0'>
          <div
            className='col-9'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
          >
            <div className='row mx-0' style={{ height: '294px' }}>
              {/* 방 리스트 */}
              {roomList[page - 1]?.map((roomInfo, index) => (
                <div
                  key={roomInfo.id + 'a'}
                  className={`col-6 px-0 pe-3 ${index < 2 ? 'pb-3' : ''}`}
                >
                  <RoomCard {...roomInfo} />
                </div>
              ))}
            </div>
          </div>
          <div className='col-3'>
            {/* 프로필 */}
            <Profile {...userProfile} />
            <button type='button' className='btn btn-secondary py-2 mt-3 w-100'>
              로그아웃
            </button>
          </div>
        </div>
      </div>
      <div>
        <h2>경기 기록</h2>
        <div>경기 기록 창</div>
      </div>
    </div>
  );
};

export default Lobby;
