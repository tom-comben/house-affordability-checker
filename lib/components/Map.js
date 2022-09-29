import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import MapRegion from "./MapRegion";
import countiesMap from "assets/region-maps/gb-counties";
import "styles/map.scss";

const Map = (props) => {
  const ref = useRef(null);
  const mapSize = {
    width: countiesMap.svg.width,
    height: countiesMap.svg.height,
  };

  const [regions, setRegions] = useState(countiesMap.paths);
  const [container, setContainer] = useState({
    width: 0,
    height: 0,
    offsetTop: 0,
    offsetLeft: 0,
  });
  const [viewbox, setViewbox] = useState({
    minX: 0,
    minY: 0,
    width: 0,
    height: 0,
  });

  // updates the container state and keeps the map the same size when the window is resized
  const windowResized = () => {
    const newWidth = ref.current.parentNode.offsetWidth;
    const newHeight = ref.current.parentNode.offsetHeight;
    const containerAR = newWidth / newHeight;
    const mapAR = mapSize.width / mapSize.height;
    const scale =
      container.height === 0 || container.width === 0
        ? 1
        : containerAR > mapAR
        ? newHeight / container.height
        : newWidth / container.width;

    setContainer({
      width: newWidth,
      height: newHeight,
      offsetTop: ref.current.parentNode.offsetTop,
      offsetLeft: ref.current.parentNode.offsetLeft,
    });

    if (containerAR > mapAR) {
      setViewbox({
        minX: Math.round(viewbox.minX),
        minY: Math.round(viewbox.minY),
        width: Math.round(mapSize.height * containerAR),
        height: Math.round(mapSize.height),
      });
    } else {
      setViewbox({
        minX: Math.round(viewbox.minX),
        minY: Math.round(viewbox.minY),
        width: Math.round(mapSize.height),
        height: Math.round(mapSize.height / containerAR),
      });
    }
  };

  // set initial containerSize on mount
  useEffect(() => {
    mapSize.width = countiesMap.svg.width;
    mapSize.height = countiesMap.svg.height;
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

  const fillColor = "green";
  const regionClicked = () => {
    return true;
  };

  const zoomMap = (event) => {
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

    const xRatio = (event.clientX - container.offsetLeft) / container.width;
    const yRatio = (event.clientY - container.offsetTop) / container.height;
    setViewbox({
      minX: viewbox.minX + viewbox.width * xRatio * (1 - scale),
      minY: viewbox.minY + viewbox.height * yRatio * (1 - scale),
      width: viewbox.width * scale,
      height: viewbox.height * scale,
    });
  };

  return (
    <div
      className="map-container"
      ref={ref}
      onWheel={(event) => zoomMap(event)}
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
        {regions.map((region) => (
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
