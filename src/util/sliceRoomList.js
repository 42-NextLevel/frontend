export const sliceRoomList = ({ roomList }) => {
  const slicedRoomList = [];

  for (let i = 0; i < roomList.length; i += 4) {
    const chunk = roomList.slice(i, i + 4);
    slicedRoomList.push(chunk);
  }

  return slicedRoomList;
};
