import Profile from '@/components/Profile/index';
import RoomCard from './components/RoomCard';
import AddRoundIcon from '/images/add-round.svg';
import RefreshIcon from '/images/refresh.svg';
import { getRoomList } from '../../services/game';
import { getUserProfile } from '../../services/user';
import { useState, useEffect } from '@/library/hooks.js';
// import { getTestRoomList, getTestUserProfile } from '../../services/test';

const Lobby = () => {
  const [roomList, setRoomList] = useState([]);
  const [userProfile, setUserProfile] = useState();

  const fetchRoomList = async () => {
    const response = [...(await getRoomList())];
    // const response = [...(await getTestRoomList())];
    setRoomList(response);
  };

  const fetchUserProfile = async () => {
    const response = await getUserProfile();
    // const response = await getTestUserProfile();
    setUserProfile(response);
  };

  useEffect(async () => {
    fetchRoomList();
    fetchUserProfile();
  }, []);

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
          <div className='col-9'>
            <div className='row mx-0 overflow-scroll' style='height: 310px'>
              {/* 방 리스트 */}
              {roomList.map((roomInfo) => (
                <div className='col-6 px-0 pe-3 pb-3'>
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
