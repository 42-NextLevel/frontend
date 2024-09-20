import defaultImg from '/images/42_logo.png';

const Profile = ({ image, intraId, nickname = '' }) => {
  return (
    <div className='card text-center align-items-center justify-content-center profile'>
      <img
        src={image ? image : defaultImg}
        className='rounded-circle mt-2'
        alt='profile_image'
      />
      <div className='pt-3 pb-2'>@{intraId}</div>
      {nickname && <h5>{nickname}</h5>}
    </div>
  );
};

export default Profile;
