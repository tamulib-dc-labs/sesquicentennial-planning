export const pushToDataLayer = (data) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

declare global {
  interface Window {
    dataLayer: any[];
  }
}