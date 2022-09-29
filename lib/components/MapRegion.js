import React from "react";

const MapRegion = (props) => {
  return (
    <path
      id={props.id}
      d={props.d}
      onClick={() => onClick()}
      fill={props.fillColor}
    ></path>
  );
};

export default MapRegion;
