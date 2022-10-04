export default class MapTransformer {
  #container = {};
  #map = {};
  #startMapPos = [0, 0];
  #isDragging = false;
  #viewbox = {
    minX: 0,
    minY: 0,
    width: 0,
    height: 0,
  };

  constructor(map) {
    this.#map = { width: map.svg.width, height: map.svg.height };
  }

  #setViewbox(viewbox) {
    this.#viewbox = {
      minX: viewbox.minX,
      minY: viewbox.minY,
      width: viewbox.width,
      height: viewbox.height,
    };
  }

  get viewbox() {
    return this.#viewbox;
  }

  #setContainer(container) {
    this.#container = {
      width: container.offsetWidth,
      height: container.offsetHeight,
      offsetTop: container.offsetTop,
      offsetLeft: container.offsetLeft,
    };
  }

  containerResized(container) {
    this.#setContainer(container);
    const mapAR = this.#map.width / this.#map.height;
    if (this.containerAR > mapAR) {
      this.#setViewbox({
        minX: 0,
        minY: 0,
        width: Math.round(this.#map.height * this.containerAR),
        height: Math.round(this.#map.height),
      });
    } else {
      this.#setViewbox({
        minX: 0,
        minY: 0,
        width: Math.round(this.#map.height),
        height: Math.round(this.#map.height / this.containerAR),
      });
    }
  }

  setInitialParams(container) {
    this.containerResized(container);
  }

  get isDragging() {
    return this.#isDragging;
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

  dragStart(event) {
    this.#startMapPos = this.#getMapPosFromMousePos([
      event.clientX,
      event.clientY,
    ]);
    this.#isDragging = true;
  }

  dragEnd() {
    this.#isDragging = false;
  }

  #updateViewboxMins(event) {
    const viewbox = this.#viewbox;
    const newMapPos = this.#getMapPosFromMousePos([
      event.clientX,
      event.clientY,
    ]);
    viewbox.minX = viewbox.minX - (newMapPos[0] - this.#startMapPos[0]);
    viewbox.minY = viewbox.minY - (newMapPos[1] - this.#startMapPos[1]);
  }

  #panMap(event) {
    this.#updateViewboxMins(event);
  }

  #zoomMap(event) {
    const viewbox = this.#viewbox;
    const map = this.#map;
    const scale = event.deltaY < 0 ? 0.8 : 1.25;
    if (viewbox.width > map.width && viewbox.height > map.height && scale > 1) {
      return;
    }
    if (viewbox.width < 200 && viewbox.height < 200 && scale < 1) {
      return;
    }

    if (!this.#isDragging) {
      this.#startMapPos = this.#getMapPosFromMousePos([
        event.clientX,
        event.clientY,
      ]);
    }
    viewbox.width *= scale;
    viewbox.height *= scale;
    this.#updateViewboxMins(event);
  }

  transformMap(event) {
    switch (event.type) {
      case "mousemove":
        this.#panMap(event);
        break;
      case "wheel":
        this.#zoomMap(event);
        break;
    }
  }
}
