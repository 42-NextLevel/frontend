import Button from '@/components/Button/index';
import Profile from '@/components/Profile/index';
import RoomCard from './components/RoomCard';

const Lobby = () => {
  const testInfo = {
    roomType: 0,
    name: '테스트 방',
    people: 1,
  };
  const testProfile = {
    image: '',
    intraId: 'junsbae',
    nickname: 'NickName',
  };

  return (
    <>
      <div>
        <div>
          <h2>방 리스트</h2>
          <Button>+ 방 만들기</Button>
          <Button>새로고침</Button>
        </div>
        <div>
          <div>
            <div>방 리스트</div>
            <RoomCard {...testInfo} />
          </div>
          <div>
            <div>프로필</div>
            <Profile {...testProfile} />
            <Button>로그아웃</Button>
          </div>
        </div>
      </div>
      <div>
        <h2>경기 기록</h2>
        <div>경기 기록 창</div>
      </div>
    </>
  );
};

export default Lobby;
