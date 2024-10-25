import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { postJoinRoom } from '@/services/game';
import { useState } from '@/library/hooks.js';

const JoinModal = ({ id, name }) => {
  const [nickname, setNickname] = useState('');

  const joinRoom = async () => {
    const data = {
      nickname: nickname,
      roomId: id,
    };
    const response = await postJoinRoom(data);
  };

  const resetInput = () => {
    setNickname('');
  }

  return (
    <Modal id={id} onClick={joinRoom} onClose={resetInput} title={`\"${name}\" 입장`} btnText='입장'>
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
