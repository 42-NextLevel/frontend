const Badge = ({ roomType }) => {
  const cardClass =
    'card border-3 p-1 badge_class ' +
    (roomType ? 'border-success' : 'border-primary');

  const textClass =
    'card-text fw-semibold text-center ' +
    (roomType ? 'text-success' : 'text-primary');

  const text = roomType ? '토너먼트' : '개인전';

  return (
    <div className={cardClass}>
      <div className={textClass}>{text}</div>
    </div>
  );
};

export default Badge;
