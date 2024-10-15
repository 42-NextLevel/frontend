import defaultImg from '/images/42_logo.png';

const Profile = ({ image, intraId, nickname = '' }) => {
  return (
    <div className='card'>
      <div className='ratio ratio-1x1'>
        <div className='d-flex flex-column text-center align-items-center justify-content-center'>
          <img
            src={image ? image : defaultImg}
            className='object-fit-contain rounded-circle mt-2'
            alt='profile_image'
          />
          <div className='pt-3 pb-2'>@{intraId}</div>
          {nickname && <h5>{nickname}</h5>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
