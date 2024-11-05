import defaultImg from '/images/42_logo.png';

const Profile = ({ image, intraId, nickname = '' }) => {
  return (
    <div className='card ratio-1 d-flex flex-column text-center align-items-center justify-content-center bg-transparent'>
      <img
        src={image ? image : defaultImg}
        className='object-fit-cover profile-image ratio-1 rounded-circle mt-2'
        alt='profile_image'
      />
      <div className='pt-3 pb-2'>@{intraId}</div>
      {nickname && <h5>{nickname}</h5>}
    </div>
  );
};

export default Profile;
