import Badge from '@/components/Badge/index';
import userIconFill from '/images/user_icon_fill.svg';

const RoomTile = ({ roomType, name, people }) => {
  return (
    <div className='card col-sm-6'>
      <Badge roomType={roomType} />
      <h3 className='mt-2'>{name}</h3>
      <div className='text-end'>
        <img src={userIconFill} alt='user_icon_fill' />
        {people} / {roomType === 0 ? 2 : 4}
      </div>
    </div>
  );
};

export default RoomTile;
