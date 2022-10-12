const MapRegion = ({ id, d, onClick, updateFillColor }) => {
  return (
    <path
      id={id}
      d={d}
      onClick={() => onClick(id)}
      fill={updateFillColor(id)}
    ></path>
  );
};

export default MapRegion;
