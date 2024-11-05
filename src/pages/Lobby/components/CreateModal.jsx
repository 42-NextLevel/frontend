import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { useState } from '@/library/hooks.js';
import { postMakeRoom } from '@/services/game';
import { useNavigate } from '@/library/router/hooks.js';

const initialRoomState = {
  name: '',
  nickname: '',
  roomType: 0,
};

const CreateModal = ({ id }) => {
  const [room, setRoom] = useState(initialRoomState);
  const navigate = useNavigate();
  const isTournament = room.roomType === 1;

  const makeRoom = async () => {
    postMakeRoom(room).then(({ roomId }) => {
      navigate(`/room/${roomId}`);
    });
  };

  const resetInput = () => {
    setRoom(initialRoomState);
  };

  return (
    <Modal
      id={id}
      onClick={makeRoom}
      onClose={resetInput}
      title='방만들기'
      btnText='만들기'
    >
      <Input
        label='방제목'
        type='text'
        placeholder='방 제목을 입력해주세요'
        value={room.name}
        onChange={(e) => setRoom((prev) => ({ ...prev, name: e.target.value }))}
      />

      <Input
        label='닉네임'
        type='text'
        placeholder='참가 닉네임을 입력해주세요'
        value={room.nickname}
        onChange={(e) =>
          setRoom((prev) => ({ ...prev, nickname: e.target.value }))
        }
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
          checked={!isTournament}
          onChange={() => setRoom((prev) => ({ ...prev, roomType: 0 }))}
        />
        <label className='btn btn-outline-primary' htmlFor='1v1'>
          개인전
        </label>

        <input
          type='radio'
          className='btn-check'
          name='btnradio'
          id='tournament'
          checked={isTournament}
          onChange={() => setRoom((prev) => ({ ...prev, roomType: 1 }))}
        />
        <label className='btn btn-outline-primary' htmlFor='tournament'>
          토너먼트
        </label>
      </div>
    </Modal>
  );
};

export default CreateModal;
