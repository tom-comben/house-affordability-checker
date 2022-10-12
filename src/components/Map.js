import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import MapRegion from "./MapRegion";
import countiesMap from "assets/region-maps/gb-counties";
import districtsMap from "assets/region-maps/gb-boroughs";
import MapTransformer from "utils/MapTransformer";
import "styles/map.scss";

const Map = (props) => {
  const [maps] = useState({ counties: countiesMap, districts: districtsMap });
  const ref = useRef(null);
  const mapTransformer = useRef(new MapTransformer(maps[props.regionSize]));
  const [viewbox, setViewbox] = useState({
    minX: 0,
    minY: 0,
    width: 0,
    height: 0,
  });

  const dragStart = (event) => {
    mapTransformer.current.dragStart(event);
  };

  const drag = (event) => {
    if (mapTransformer.current.isDragging) {
      mapTransformer.current.transformMap(event);
      setViewbox({
        ...mapTransformer.current.viewbox,
      });
    }
  };

  const dragEnd = () => {
    mapTransformer.current.dragEnd();
    return;
  };

  // updates the container state and keeps the map the same size when the window is resized
  const windowResized = () => {
    mapTransformer.current.containerResized(ref.current.parentNode);
    setViewbox({ ...mapTransformer.current.viewbox });
  };

  // set initial containerSize on mount
  useEffect(() => {
    windowResized();
  }, []);

  // update containerSize on window resize
  useEffect(() => {
    let timeout = 0;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        windowResized();
      }, 20);
    };
    window.addEventListener("resize", () => {
      handleResize();
    });
  });

  const zoomMap = (event) => {
    mapTransformer.current.transformMap(event);
    setViewbox({ ...mapTransformer.current.viewbox });
  };

  const updateFillColor = (regionId) => {
    if (props.priceData[regionId] && props.maxBudget) {
      const totalPriceData = props.priceData[regionId].total;
      if (props.maxBudget >= totalPriceData["quartiles"]["uq"]) {
        return "#00ff00";
      } else if (props.maxBudget >= totalPriceData["quartiles"]["median"]) {
        return "#ffff00";
      } else if (props.maxBudget >= totalPriceData["quartiles"]["lq"]) {
        return "#ffbf00";
      } else if (props.maxBudget >= totalPriceData["min"]) {
        return "#ff8000";
      } else {
        return "#ff0000";
      }
    } else {
      return "grey";
    }
  };

  const onRegionClick = (regionId) => {
    const regionPriceData = props.priceData[regionId];
    console.log(regionId);
    if (regionPriceData && props.maxBudget) {
      const totalPriceData = regionPriceData["total"];
      console.log(
        `Price range: ${totalPriceData["min"]} to ${totalPriceData["max"]}`
      );
      console.log(`Median price: ${totalPriceData["quartiles"]["median"]}`);
      console.log("max budget:", props.maxBudget);
    } else {
      console.log("Not enough data");
    }
  };

  return (
    <div
      className="map-container"
      ref={ref}
      onWheel={(event) => zoomMap(event)}
      onMouseDown={(event) => dragStart(event)}
      onMouseMove={(event) => drag(event)}
      onMouseUp={(event) => dragEnd(event)}
    >
      <svg
        className="map-svg"
        fill="#7c7c7c"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="10"
        version="1.2"
        height="100%"
        width="100%"
        viewBox={
          viewbox.minX +
          " " +
          viewbox.minY +
          " " +
          viewbox.width +
          " " +
          viewbox.height
        }
        preserveAspectRatio="none"
      >
        {maps[props.regionSize].paths.map((region) => (
          <MapRegion
            key={region.id}
            id={region.id}
            d={region.d}
            priceData={props.priceData[region.id]}
            onClick={onRegionClick}
            updateFillColor={updateFillColor}
            maxBudget={props.maxBudget}
          />
        ))}
      </svg>
    </div>
  );
};

export default Map;
