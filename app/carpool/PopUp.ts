import styles from "./styles.module.css";

export interface OverlayViewSafe extends google.maps.OverlayView {}

function extend(type1: any, type2: any): void {
  for (let property in type2.prototype) {
    type1.prototype[property] = type2.prototype[property];
  }
}

export class OverlayViewSafe {
  constructor() {
    // We use the extend function for google.maps.OverlayView
    // because it might not always be available when the code is defined.
    extend(OverlayViewSafe, google.maps.OverlayView);
  }
}

export class PopUp extends OverlayViewSafe {
  position: google.maps.LatLng | undefined;
  popupContainer: HTMLDivElement | undefined;

  constructor(position: google.maps.LatLng, content: HTMLElement) {
    super();
    this.position = position;

    const contentContainer = document.createElement("div");
    contentContainer.classList.add(styles.popupBubble);
    contentContainer.appendChild(content);

    // This zero-height div is positioned at the bottom of the bubble.
    const bubbleAnchor = document.createElement("div");
    bubbleAnchor.classList.add(styles.popupBubbleAnchor);
    bubbleAnchor.appendChild(contentContainer);

    // This zero-height div is positioned at the bottom of the tip.
    this.popupContainer = document.createElement("div");
    this.popupContainer.classList.add(styles.popupContainer);
    this.popupContainer.appendChild(bubbleAnchor);

    // close button
    const closeButton = document.createElement("button");
    closeButton.classList.add(styles.closeButton);
    closeButton.textContent = "X";
    closeButton.onclick = () => this.setMap(null);

    content.appendChild(closeButton);
  }

  /** Called when the popup is added to the map. */
  onAdd() {
    this.getPanes()!.floatPane.appendChild(this.popupContainer!);
  }

  /** Called when the popup is removed from the map. */
  onRemove() {
    const closeButton = document.getElementsByClassName(styles.closeButton);
    closeButton[0].remove();
    const container = document.getElementsByClassName(styles.popupContainer);
    container[0].remove();
  }

  /** Called each frame when the popup needs to draw itself. */
  draw() {
    const divPosition = this.getProjection().fromLatLngToDivPixel(this.position!);

    // Hide the popup when it is far out of view.
    const display =
      Math.abs(divPosition!.x) < 4000 && Math.abs(divPosition!.y) < 4000
        ? "block"
        : "none";

    if (display === "block") {
      this.popupContainer!.style.left = divPosition!.x + "px";
      this.popupContainer!.style.top = divPosition!.y + "px";
    }

    if (this.popupContainer!.style.display !== display) {
      this.popupContainer!.style.display = display;
    }
  }
}
