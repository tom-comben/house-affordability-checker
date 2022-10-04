import React, { useEffect, useState } from "react";

const MapRegion = ({ priceData, maxBudget, ...props }) => {
  const [fillColor, setFillColor] = useState("grey");
  useEffect(() => {
    updateFillColor();
  });

  const updateFillColor = () => {
    if (priceData && maxBudget) {
      const totalPriceData = priceData.total;
      if (maxBudget >= totalPriceData["quartiles"]["uq"]) {
        setFillColor("#00ff00");
      } else if (maxBudget >= totalPriceData["quartiles"]["median"]) {
        setFillColor("#ffff00");
      } else if (maxBudget >= totalPriceData["quartiles"]["lq"]) {
        setFillColor("#ffbf00");
      } else if (maxBudget >= totalPriceData["min"]) {
        setFillColor("#ff8000");
      } else {
        setFillColor("#ff0000");
      }
    }
  };

  const onClick = () => {
    if (priceData && maxBudget) {
      const totalPriceData = priceData["total"];
      console.log(props.id);
      console.log(
        `Price range: ${totalPriceData["min"]} to ${totalPriceData["max"]}`
      );
      console.log(`Median price: ${totalPriceData["quartiles"]["median"]}`);
    } else {
      console.log(props.id);
      console.log("Not enough data");
    }
  };

  return (
    <path
      id={props.id}
      d={props.d}
      onClick={() => onClick()}
      fill={fillColor}
    ></path>
  );
};

export default MapRegion;
