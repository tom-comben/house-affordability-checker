export default class MapTransformer {
  #container = { width: 0, height: 0, offsetTop: 0, offsetleft: 0 };
  #map = { width: 0, height: 0 };
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

  // possibly remove Math.round if it behaves weirdly with scaling
  containerResized(container) {
    const oldContainer = { ...this.#container };
    this.#setContainer(container);
    const mapAR = this.#map.width / this.#map.height;
    const newViewbox = { ...this.#viewbox };
    if (newViewbox.height === 0 || newViewbox.width === 0) {
      console.log("XXXXXXXX");
      if (this.containerAR > mapAR) {
        newViewbox.width = Math.round(this.#map.height * this.containerAR);
        newViewbox.height = Math.round(this.#map.height);
        newViewbox.minX = (this.#map.width - newViewbox.width) / 2;
        newViewbox.minY = 0;
      } else {
        newViewbox.width = Math.round(this.#map.width);
        newViewbox.height = Math.round(this.#map.width / this.containerAR);
        newViewbox.minX = 0;
        newViewbox.minY = (this.#map.height - newViewbox.height) / 2;
      }
    } else {
      const newWidth =
        (newViewbox.width * this.#container.width) / oldContainer.width;
      const newHeight =
        (newViewbox.height * this.#container.height) / oldContainer.height;
      if (newWidth > this.#map.width && newHeight > this.#map.height) {
        if (this.containerAR > mapAR) {
          newViewbox.width = Math.round(this.#map.height * this.containerAR);
          newViewbox.height = Math.round(this.#map.height);
        } else {
          newViewbox.width = Math.round(this.#map.width);
          newViewbox.height = Math.round(this.#map.width / this.containerAR);
        }
      } else {
        newViewbox.width = newWidth;
        newViewbox.height = newHeight;
      }
      newViewbox.minX =
        newViewbox.minX + (this.#viewbox.width - newViewbox.width) / 2;
      newViewbox.minY =
        newViewbox.minY + (this.#viewbox.height - newViewbox.height) / 2;
    }
    this.#setViewbox(newViewbox);
    // console.log(newViewbox);
    // if (this.containerAR > mapAR) {
    //   const viewboxWidth = Math.round(this.#map.height * this.containerAR);
    //   const minX = (this.#map.width - viewboxWidth) / 2;
    //   this.#setViewbox({
    //     minX: minX,
    //     minY: 0,
    //     width: viewboxWidth,
    //     height: Math.round(this.#map.height),
    //   });
    // } else {
    //   const viewboxHeight = Math.round(this.#map.width / this.containerAR);
    //   const minY = (this.#map.height - viewboxHeight) / 2;
    //   this.#setViewbox({
    //     minX: 0,
    //     minY: minY,
    //     width: Math.round(this.#map.width),
    //     height: viewboxHeight,
    //   });
    // }
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
    if (
      viewbox.width > map.width &&
      viewbox.height >= map.height &&
      scale >= 1
    ) {
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
