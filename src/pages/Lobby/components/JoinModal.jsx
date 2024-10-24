import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { postJoinRoom } from '@/services/game';
import { useState } from '@/library/hooks.js';
import { useNavigate } from '@/library/router/hooks.js';

const JoinModal = ({ id, room }) => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const joinRoom = async () => {
    postJoinRoom({
      nickname: nickname,
      roomId: room.id,
    })
      .then(() => {
        navigate(`/room/${room.id}`);
      })
      .catch(() => {
        alert('입장할 수 없습니다.');
      });
  };
  return (
    <Modal
      id={id}
      onClick={joinRoom}
      title={`\"${room.name}\" 입장`}
      btnText='입장'
    >
      <Input
        label='닉네임'
        type='text'
        placeholder='참가 닉네임을 입력해주세요'
        onChange={(e) => setNickname(e.target.value)}
      />
    </Modal>
  );
};

export default JoinModal;
