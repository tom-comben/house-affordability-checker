import React from "react";

const MapRegion = (props) => {
  return (
    <path
      id={props.id}
      d={props.d}
      onClick={() => props.onClick(props.id)}
      fill={props.fillColor}
    ></path>
  );
};

export default MapRegion;
