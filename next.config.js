/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves plain files: `next build` writes the whole site to out/.
  output: "export",

  // There is no image optimisation server on GitHub Pages.
  images: {
    unoptimized: true,
  },

  webpack: (config) => {
    // react-pdf optionally requires the Node "canvas" package; not in the browser.
    config.resolve.alias.canvas = false;

    return config;
  },
};

module.exports = nextConfig;
