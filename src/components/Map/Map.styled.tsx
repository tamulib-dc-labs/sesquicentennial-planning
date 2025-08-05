import { styled } from "@styles/stitches";

const MapStyled = styled("div", {
  height: "100vh",
  width: "100%",
  position: "fixed",
  zIndex: "0",
  top: "0",

  ".map-container": {
    height: "100%",
    width: "100%",
    backgroundColor: "var(--gray-1)",
    figure: {
      width: "100%",
      margin: "0",
      padding: "0",
    },
  },

  html: {
    overflow: "hidden",
  },

  "html.dark .leaflet-layer": { 
    filter: "invert(100%) hue-rotate(180deg) brightness(90%) contrast(90%)",
  },

  ".leafletPopupContentWrapper": {
    backgroundColor: "var(--gray-2)",
  },

  ".leafletPopupContent": {
    margin: 0,
  },

  ".leafletPopupTip": {
    backgroundColor: "var(--accent-a10)",
  },

  ".leaflet-popup": {
      width: "240px",
  },

  ".leaflet-popup-content-wrapper": {
      backgroundColor: "var(--gray-2)",
      overflow: "hidden",
      border: "none",
  },

  ".leaflet-popup-content": {
    margin: "0",

      img: {
        maxHeight: "100% !important",
      },
  },

  ".leaflet-popup-tip": {
    backgroundColor: "var(--accent-a10)",
    opacity: "0.2",
  },

  ".leaflet-control": {
    backgroundColor: "var(--accent-10)",
  },

  ".leaflet-control-layers": {
    display: "none",
  },

  ".leaflet-bar a": {
    backgroundColor: "var(--accent-10)",
    color: "var(--gray-12)",
    fill: "var(--gray-12)",
  },

  ".canopyMapPopup": {
    width: "240px",
    img: {
      maxHeight: "100% !important",
    },
  },

  figure: {
    img: {
      width: "100%",
      maxHeight: "200px",
    },
    video: {
      display: "none",
    },
  },
});

export { MapStyled };
