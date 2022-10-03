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
  const mapSize = {
    width: currentMap.svg.width,
    height: currentMap.svg.height,
  };
  const fillColor = "green";
  const [viewbox, setViewbox] = useState({
    minX: 0,
    minY: 0,
    width: 0,
    height: 0,
  });

  const panStart = (event) => {
    mapTransformer.current.panStart(event, viewbox);
  };

  const pan = (event) => {
    if (mapTransformer.current.isPanning) {
      const newViewboxParams = mapTransformer.current.transformMap(event);
      setViewbox({
        ...viewbox,
        ...newViewboxParams,
      });
    }
  };

  const panEnd = (event) => {
    mapTransformer.current.panEnd();
    return;
  };

  // updates the container state and keeps the map the same size when the window is resized
  const windowResized = () => {
    mapTransformer.current.container = ref.current.parentNode;
    const containerAR = mapTransformer.current.containerAR;
    const mapAR = mapSize.width / mapSize.height;
    const newViewbox =
      containerAR > mapAR
        ? {
            minX: Math.round(viewbox.minX),
            minY: Math.round(viewbox.minY),
            width: Math.round(mapSize.height * containerAR),
            height: Math.round(mapSize.height),
          }
        : {
            minX: Math.round(viewbox.minX),
            minY: Math.round(viewbox.minY),
            width: Math.round(mapSize.height),
            height: Math.round(mapSize.height / containerAR),
          };
    // setContainer(newContainer);
    setViewbox(newViewbox);
    mapTransformer.current.setInitialParams(ref.current.parentNode, newViewbox);
  };

  // set initial containerSize on mount
  useEffect(() => {
    mapSize.width = currentMap.svg.width;
    mapSize.height = currentMap.svg.height;
    mapTransformer.current.setInitialParams(ref.current.parentNode, viewbox);
    windowResized();
  }, []);

  // update containerSize on window resize
  useEffect(() => {
    let timeout = 0;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        windowResized();
      }, 50);
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

  const zoomMap = async (event) => {
    const scale = event.deltaY < 0 ? 0.8 : 1.25;
    // upper bound for viewbox size
    if (
      viewbox.width > mapSize.width &&
      viewbox.height > mapSize.height &&
      scale > 1
    ) {
      return;
    }

    // lower bound for viewbox size
    if (viewbox.width < 50 && viewbox.height < 50 && scale < 1) {
      return;
    }
    const newViewbox = mapTransformer.current.transformMap(event);
    setViewbox((previousViewbox) => ({
      ...previousViewbox,
      ...newViewbox,
    }));
  };

  return (
    <div
      className="map-container"
      ref={ref}
      onWheel={(event) => zoomMap(event)}
      onMouseDown={(event) => panStart(event)}
      onMouseMove={(event) => pan(event)}
      onMouseUp={(event) => panEnd(event)}
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
