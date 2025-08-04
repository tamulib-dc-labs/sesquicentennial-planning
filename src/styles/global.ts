import { globalCss } from "@stitches/react";

export const rem = 20;
export const headerHeight = 55.5167;

const defaults = {
  body: {
    margin: 0,
    padding: 0,
  },

  html: {
    fontFamily: "$sans",
    fontSize: `${rem}px`,
    fontWeight: "500",
    fontSmooth: "always",
    webKitFontSmothing: "antialiased",
    mozOsxFontSmoth: "grayscale",
    paddingTop: `${headerHeight}px`,
  },

  "ul, ol": {
    li: {
      paddingBottom: "$gr1",
    },
  },

  dl: {
    dt: {
      fontWeight: "400",
    },
    dd: {
      marginInlineStart: "0",
      paddingBottom: "$gr4",
      lineHeight: "1.47em",
    },
  },

  ".radix-themes": {
      '--red-1': '#fefcfc',
      '--red-2': '#fff8f8',
      '--red-3': '#ffefef',
      '--red-4': '#ffe5e5',
      '--red-5': '#fdd8d8',
      '--red-6': '#f9c6c6',
      '--red-7': '#f3aeae',
      '--red-8': '#eb9091',
      '--red-9': '#500000', // TAMU maroon
      '--red-10': '#480000',
      '--red-11': '#400000',
      '--red-12': '#2d0000',

      '--red-a1': 'rgba(80, 0, 0, 0.012)',
      '--red-a2': 'rgba(80, 0, 0, 0.027)',
      '--red-a3': 'rgba(80, 0, 0, 0.047)',
      '--red-a4': 'rgba(80, 0, 0, 0.071)',
      '--red-a5': 'rgba(80, 0, 0, 0.102)',
      '--red-a6': 'rgba(80, 0, 0, 0.145)',
      '--red-a7': 'rgba(80, 0, 0, 0.204)',
      '--red-a8': 'rgba(80, 0, 0, 0.278)',
      '--red-a9': 'rgba(80, 0, 0, 1)',     // Full opacity
      '--red-a10': 'rgba(72, 0, 0, 1)',
      '--red-a11': 'rgba(64, 0, 0, 1)',
      '--red-a12': 'rgba(45, 0, 0, 1)',
  }
};

const globalStyles = globalCss({
  ...defaults,
});

export default globalStyles;
