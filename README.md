# ol-sp (OpenLayers Simple Point)

:warning: At the moment, this is really only meant for my own personal use and is not production ready!

A basic map using OpenLayers to generate a point with an icon and a popup.

This can be embedded on any site.

## Configuration Examples

The following list is a list of files meant to help you embed this in your own website:

### Required files

- **Required**: [Example `index.html`](https://github.com/servedsmart/ol-sp/tree/main/index.html)
- **Required**: [Example `config.js`](https://github.com/servedsmart/ol-sp/tree/main/src/config.js)
- **Required**: [Example `location-dot.svg`](https://github.com/servedsmart/ol-sp/tree/main/src/assets/icons/location-dot.svg)
- **Required**: Install `ol-sp.min.esm.js` via the npm package [`ol-sp`](https://www.npmjs.com/package/ol-sp)
- **Required**: Install `ol-sp.min.css` via the npm package [`ol-sp`](https://www.npmjs.com/package/ol-sp)

### Documentation

At the moment, there isn't any/enough documentation. How to use this can be seen in [`index.html`](https://github.com/servedsmart/ol-sp/tree/main/index.html) and [`config.js`](https://github.com/servedsmart/ol-sp/tree/main/src/config.js).

You can either use `data-` values for configuration as shown in [`index.html`](https://github.com/servedsmart/ol-sp/tree/main/index.html) or declare everything in a similar way as can be seen in [`config.js`](https://github.com/servedsmart/ol-sp/tree/main/src/config.js).

The code in [`main.js`](https://github.com/servedsmart/ol-sp/tree/main/src/main.js) might also be helpful if you want to know more. All classes, functions, parameters etc. are documented. It's not perfect, but as I've said, this is meant for personal use. If anyone else thinks like spending time on documenting this or collaborate in general, I'd gladly appreciate that though!
