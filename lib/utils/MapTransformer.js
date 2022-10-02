export default class MapTransformer {
  #container = {};
  #map = {};
  #panParams = {
    startMousePos: [0, 0],
    startMapPos: [0, 0],
    startMinX: 0,
    startMinY: 0,
    zoomOffsetMinX: 0,
    zoomOffsetMinY: 0,
    panRatio: 1,
    isPanning: false,
  };

  constructor(map) {
    this.#map = { Width: map.svg.width, height: map.svg.height };
  }

  set container(container) {
    this.#container = {
      width: container.offsetWidth,
      height: container.offsetHeight,
      offsetTop: container.offsetTop,
      offsetLeft: container.offsetLeft,
    };
  }

  get container() {
    return this.#container;
  }

  get isPanning() {
    return this.#panParams.isPanning;
  }

  get viewboxParams() {}

  #getMapPosFromMousePos(startMousePos, container, viewbox) {
    const xRatio = (startMousePos[0] - container.offsetLeft) / container.width;
    const yRatio = (startMousePos[1] - container.offsetTop) / container.height;
    const mapX = xRatio * viewbox.width + viewbox.minX;
    const mapY = yRatio * viewbox.height + viewbox.minY;
    return [mapX, mapY];
  }

  panStart(event, viewbox) {
    const startMousePos = [event.clientX, event.clientY];
    this.#panParams = {
      startMousePos: startMousePos,
      startMapPos: this.#getMapPosFromMousePos(
        startMousePos,
        this.#container,
        viewbox
      ),
      startMinX: viewbox.minX,
      startMinY: viewbox.minY,
      zoomOffsetMinX: 0,
      zoomOffsetMinY: 0,
      panRatio: viewbox.width / this.#container.width,
      isPanning: true,
    };
  }

  #panMap(event) {
    const panParams = this.#panParams;
    const offsetX = event.clientX - panParams.startMousePos[0];
    const offsetY = event.clientY - panParams.startMousePos[1];
    const newMinX = panParams.startMinX - offsetX * panParams.panRatio;
    const newMinY = panParams.startMinY - offsetY * panParams.panRatio;
    return { minX: newMinX, minY: newMinY };
  }

  #zoomMap(event) {
    return null;
  }

  transformMap(event) {
    switch (event.type) {
      case "mousemove":
        return this.#panMap(event);
      case "wheel":
        return this.#zoomMap(event);
    }
  }

  panEnd(event) {
    this.#panParams.isPanning = false;
  }
}
