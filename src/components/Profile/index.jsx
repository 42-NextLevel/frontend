import defaultImg from '/images/42_logo.png';

const Profile = ({ profile_image, intra_id, nickname = '' }) => {
  return (
    <div className='card ratio-1 d-flex flex-column text-center align-items-center justify-content-center'>
      <img
        src={profile_image ? profile_image : defaultImg}
        className='object-fit-cover profile-image ratio-1 rounded-circle mt-2'
        alt='profile_image'
      />
      <div className='pt-3 pb-2'>@{intra_id}</div>
      {nickname && <h5>{nickname}</h5>}
    </div>
  );
};

export default Profile;
