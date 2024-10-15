import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { useState } from '@/library/hooks.js';
import { postMakeRoom } from '@/services/game';

const CreateModal = ({ id }) => {
  const [roomName, setRoomName] = useState('');
  const [nickname, setNickname] = useState('');
  const [mode, setMode] = useState(0);

  const makeRoom = async () => {
    const data = {
      name: roomName,
      nickname: nickname,
      roomType: mode,
    };
    const response = await postMakeRoom(data);
  };

  return (
    <Modal id={id} onClick={makeRoom} title='방만들기' btnText='만들기'>
      <Input
        label='방제목'
        type='text'
        placeholder='방 제목을 입력해주세요'
        onChange={(e) => setRoomName(e.target.value)}
      />

      <Input
        label='닉네임'
        type='text'
        placeholder='참가 닉네임을 입력해주세요'
        onChange={(e) => setNickname(e.target.value)}
      />
      <div>
        <label className='form-label mt-3'>모드</label>
      </div>
      <div
        className='btn-group'
        role='group'
        aria-label='Basic radio toggle button group'
      >
        <input
          type='radio'
          className='btn-check'
          name='btnradio'
          id='1v1'
          checked
          onClick={() => setMode(0)}
        />
        <label className='btn btn-outline-primary' htmlFor='1v1'>
          개인전
        </label>

        <input
          type='radio'
          className='btn-check'
          name='btnradio'
          id='tournament'
          onClick={() => setMode(1)}
        />
        <label className='btn btn-outline-primary' htmlFor='tournament'>
          토너먼트
        </label>
      </div>
    </Modal>
  );
};

export default CreateModal;
