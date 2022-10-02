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
  const panParams = useRef({
    startMouseX: 0,
    startMouseY: 0,
    startMinX: 0,
    startMinY: 0,
    zoomOffsetMinX: 0,
    zoomOffsetMinY: 0,
    offsetLimits: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
    mapX: 0,
    mapY: 0,
    panRatio: 0,
  });
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

  const panStart = (event) => {
    mapTransformer.current.panStart(event, viewbox);
    panParams.startMouseX = event.clientX;
    panParams.startMouseY = event.clientY;
    panParams.startMinX = viewbox.minX;
    panParams.startMinY = viewbox.minY;
    panParams.zoomOffsetMinX = 0;
    panParams.zoomOffsetMinY = 0;
    panParams.offsetLimits = {
      minX: 0 - viewbox.width * 0.2,
      minY: 0 - viewbox.height * 0.2,
      maxX: mapSize.width - viewbox.width * 0.8,
      maxY: mapSize.height - viewbox.height * 0.8,
    };
    panParams.panRatio = viewbox.width / container.width;
    panParams.isPanning = true;
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
    const newWidth = ref.current.parentNode.offsetWidth;
    const newHeight = ref.current.parentNode.offsetHeight;
    const containerAR =
      mapTransformer.current.container.width /
      mapTransformer.current.container.height;
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
    mapSize.width = currentMap.svg.width;
    mapSize.height = currentMap.svg.height;
    mapTransformer.current.container = ref.current.parentNode;
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
    mapTransformer.current.transformMap(event);
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
    const mapX = xRatio * viewbox.width + viewbox.minX;
    const mapY = yRatio * viewbox.height + viewbox.minY;
    setViewbox((previousViewbox) => ({
      ...previousViewbox,
      minX: mapX - scale * (mapX - viewbox.minX),
      minY: mapY - scale * (mapY - viewbox.minY),
      width: viewbox.width * scale,
      height: viewbox.height * scale,
      latestUpdate: "zoom",
    }));

    panParams.zoomOffsetMinX =
      scale * (panParams.zoomOffsetMinX + panParams.startMinX - mapX) +
      mapX -
      panParams.startMinX;
    panParams.zoomOffsetMinY =
      scale * (panParams.zoomOffsetMinY + panParams.startMinY - mapY) +
      mapY -
      panParams.startMinY;
    panParams.panRatio = panParams.panRatio * scale;
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
