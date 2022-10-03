export default class MapTransformer {
  #container = {};
  #map = {};
  #panParams = {
    startMapPos: [0, 0],
    isPanning: false,
  };
  #viewbox = {
    minX: 0,
    minY: 0,
    width: 0,
    height: 0,
  };

  #setViewbox(viewbox) {
    this.#viewbox = {
      minX: viewbox.minX,
      minY: viewbox.minY,
      width: viewbox.width,
      height: viewbox.height,
    };
  }
  #setContainer(container) {
    this.#container = {
      width: container.offsetWidth,
      height: container.offsetHeight,
      offsetTop: container.offsetTop,
      offsetLeft: container.offsetLeft,
    };
  }

  constructor(map) {
    this.#map = { Width: map.svg.width, height: map.svg.height };
  }

  setInitialParams(container, viewbox) {
    this.#setContainer(container);
    this.#setViewbox(viewbox);
  }

  get isPanning() {
    return this.#panParams.isPanning;
  }

  get containerAR() {
    return this.#container.width / this.#container.height;
  }

  get viewboxParams() {}

  #getMapPosFromMousePos(mousePos) {
    const container = this.#container;
    const viewbox = this.#viewbox;
    const xRatio = (mousePos[0] - container.offsetLeft) / container.width;
    const yRatio = (mousePos[1] - container.offsetTop) / container.height;
    const mapX = xRatio * viewbox.width + viewbox.minX;
    const mapY = yRatio * viewbox.height + viewbox.minY;
    return [mapX, mapY];
  }

  panStart(event, viewbox) {
    this.#setViewbox(viewbox);
    this.#panParams = {
      startMapPos: this.#getMapPosFromMousePos([event.clientX, event.clientY]),
      isPanning: true,
    };
  }

  #updateViewboxMins(event) {
    const viewbox = this.#viewbox;
    const panParams = this.#panParams;
    const newMapPos = this.#getMapPosFromMousePos([
      event.clientX,
      event.clientY,
    ]);

    viewbox.minX = viewbox.minX - (newMapPos[0] - panParams.startMapPos[0]);
    viewbox.minY = viewbox.minY - (newMapPos[1] - panParams.startMapPos[1]);
  }
  #panMap(event) {
    this.#updateViewboxMins(event);
    return this.#viewbox;
  }

  #zoomMap(event) {
    if (!this.#panParams.isPanning) {
      this.#panParams.startMapPos = this.#getMapPosFromMousePos([
        event.clientX,
        event.clientY,
      ]);
    }
    const viewbox = this.#viewbox;
    const scale = event.deltaY < 0 ? 0.8 : 1.25;
    viewbox.width *= scale;
    viewbox.height *= scale;
    this.#updateViewboxMins(event);
    return this.#viewbox;
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
