const Badge = ({ roomType }) => {
  const individual = 0;
  const tournament = 1;

  if (roomType === individual)
    return <div className='badge-lg green'>개인전</div>;

  if (roomType === tournament)
    return <div className='badge-lg blue'>토너먼트</div>;

  return null;
};

export default Badge;
