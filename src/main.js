/*
 * File: main.js
 * Author: Leopold Meinel (leo@meinel.dev)
 * -----
 * Copyright (c) 2025 Leopold Meinel & contributors
 * SPDX ID: MIT
 * URL: https://opensource.org/licenses/MIT
 * -----
 */

import "./style.css";

import Map from "ol/Map.js";
import Overlay from "ol/Overlay.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import { fromLonLat } from "ol/proj";
import OSM, { ATTRIBUTION } from "ol/source/OSM.js";

window.olSimplePoint = (config) => {
  const {
    mapId,
    iconId,
    popupId,

    stylesheet,
    stylesheetHash,

    extraCopyrightURL,
    extraCopyrightName,

    tileBaseURL,

    widthEqHeight,
    height,
    width,

    centerX,
    centerY,
    zoom,
    minZoom,
    maxZoom,

    pointX,
    pointY,
  } = config;

  const documentStylesheets = Array.from(document.querySelectorAll("link")).map((href) => href.href);
  if (
    stylesheet &&
    !documentStylesheets.includes(stylesheet) &&
    !documentStylesheets.includes(window.location.origin + stylesheet) &&
    !documentStylesheets.includes(window.location.origin + "/" + stylesheet)
  ) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylesheet;
    stylesheetHash && (link.integrity = stylesheetHash);
    document.head.appendChild(link);
  }

  // Initialize TileLayer that gets tiles from tileBaseURL
  const customAttribution =
    extraCopyrightURL && extraCopyrightName
      ? "&#169; " +
        `<a href="${extraCopyrightURL}" target="_blank">${extraCopyrightName}</a> ` +
        "contributors."
      : "";
  const osmMapLayer = new TileLayer({
    source: new OSM({
      attributions: [customAttribution + ATTRIBUTION],
      url: `${tileBaseURL}/{z}/{x}/{y}.png`,
      crossOrigin: "",
    }),
  });

  // Set styling for mapElement and initialize map
  const mapElement = document.getElementById(mapId);
  if (widthEqHeight) {
    mapElement.style.height = height;
    mapElement.style.width = window.getComputedStyle(mapElement).height;
  } else {
    mapElement.style.height = height;
    mapElement.style.width = width;
  }
  const map = new Map({
    layers: [osmMapLayer],
    target: mapElement,
    view: new View({
      center: fromLonLat([centerX, centerY]),
      zoom: zoom,
      minZoom: minZoom,
      maxZoom: maxZoom,
    }),
  });

  // Initialize iconOverlay and add to map
  if (!pointX || !pointY) {
    return;
  }
  const iconElement = document.getElementById(iconId);
  const iconOverlay = new Overlay({
    element: iconElement,
    positioning: "bottom-center",
    position: fromLonLat([pointX, pointY]),
    stopEvent: false,
  });
  map.addOverlay(iconOverlay);

  // Initialize popupOverlay and add to map
  const popupOffsetY = parseInt(parseInt(window.getComputedStyle(iconElement).height) * -1.2);
  const popupElement = document.getElementById(popupId);
  if (popupElement.innerHTML === "") {
    return;
  }
  const popupOverlay = new Overlay({
    element: popupElement,
    positioning: "bottom-center",
    offset: [0, popupOffsetY],
    stopEvent: false,
  });
  map.addOverlay(popupOverlay);
  popupOverlay.setPosition(undefined);

  // Display popupOverlay on click
  iconElement.addEventListener("click", (event) => {
    event.stopPropagation();
    popupOverlay.setPosition(iconOverlay.getPosition());
  });

  // Close popupOverlay on movestart and click
  map.on("movestart", () => popupOverlay.setPosition(undefined));
  map.on("click", () => popupOverlay.setPosition(undefined));
};
