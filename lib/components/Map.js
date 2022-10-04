import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import MapRegion from "./MapRegion";
import countiesMap from "assets/region-maps/gb-counties";
import districtsMap from "assets/region-maps/gb-boroughs";
import MapTransformer from "utils/MapTransformer";
import "styles/map.scss";

const Map = (props) => {
  const [maps] = useState({ county: countiesMap, district: districtsMap });
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
            maxBudget={props.maxBudget}
          />
        ))}
      </svg>
    </div>
  );
};

export default Map;
