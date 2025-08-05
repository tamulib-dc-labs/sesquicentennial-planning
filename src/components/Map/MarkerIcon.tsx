import Leaflet from "leaflet";

const markerIconHtml = (src: string, label: string) => {
  return `<button data-accent-color="" data-radius="full" style="box-shadow: var(--shadow-3); cursor: pointer; outline-style: none;" class="rt-reset rt-BaseButton rt-r-size-2 rt-variant-solid rt-IconButton"><img class="canopy-marker-image" src="${src}" alt="${label}" style="height: 100%; width: 100%; border-radius: 50%; object-fit: cover;" /></button>`;
};

function MarkerIcon(src: string, label: string) {
  return Leaflet.divIcon({
    className: "canopy-map-marker-icon",
    html: markerIconHtml(src, label).toString(),
    iconSize: Leaflet.point(32, 32, true),
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export { MarkerIcon };