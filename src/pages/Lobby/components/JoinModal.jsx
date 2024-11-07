import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { postJoinRoom } from '@/services/game';
import { useState } from '@/library/hooks.js';
import { useNavigate } from '@/library/router/hooks.js';
import { ERROR_MESSAGE } from '../constants.js';

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
      .catch((e) => {
        const { error } = e.response.data;
        alert(ERROR_MESSAGE[error]);
      });
  };

  const resetInput = () => {
    setNickname('');
  };

  return (
    <Modal
      id={id}
      onClick={joinRoom}
      onClose={resetInput}
      title={`\"${room.name}\" 입장`}
      btnText='입장'
    >
      <Input
        label='닉네임'
        type='text'
        placeholder='참가 닉네임을 입력해주세요'
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
    </Modal>
  );
};

export default JoinModal;
