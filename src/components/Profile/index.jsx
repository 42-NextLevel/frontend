import defaultImg from '/images/42_logo.png';

const Profile = ({ image, intraId, nickname = '' }) => {
  return (
    <div className='card border-3 text-center align-items-center justify-content-center profile'>
      <img
        src={image ? image : defaultImg}
        className='rounded-circle'
        alt='profile_image'
      />
      <div className='pt-1 pb-1'>@{intraId}</div>
      {nickname && <h5>{nickname}</h5>}
    </div>
  );
};

export default Profile;
