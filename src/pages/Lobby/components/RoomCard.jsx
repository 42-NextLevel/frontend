import Badge from '@/components/Badge/index';
import userIconFill from '/images/user_icon_fill.svg';

const RoomTile = ({ roomType, name, people }) => {
  return (
    <div className='card' style='cursor: pointer;'>
      <Badge roomType={roomType} />
      <h5 className='mt-2'>{name}</h5>
      <div className='text-end'>
        <img src={userIconFill} alt='user_icon_fill' />
        {people} / {roomType === 0 ? 2 : 4}
      </div>
    </div>
  );
};

export default RoomTile;
