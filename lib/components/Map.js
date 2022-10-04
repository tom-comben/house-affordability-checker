import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import MapRegion from "./MapRegion";
import countiesMap from "assets/region-maps/gb-counties";
import MapTransformer from "utils/MapTransformer";
import "styles/map.scss";

const Map = (props) => {
  const [currentMap, setCurrentMap] = useState(countiesMap);
  const ref = useRef(null);
  const mapTransformer = useRef(new MapTransformer(currentMap));
  const fillColor = "green";
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

  const regionClicked = (regionId) => {
    if (!mapTransformer.current.isPanning) {
      console.log(regionId);
    }
  };

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
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
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
        {currentMap.paths.map((region) => (
          <MapRegion
            key={region.id}
            id={region.id}
            d={region.d}
            fillColor={fillColor}
            onClick={regionClicked}
          />
        ))}

        <rect
          id="posTestRect"
          x="25000"
          y="80000"
          width="500"
          height="500"
          fill="red"
        ></rect>
      </svg>
    </div>
  );
};

export default Map;
