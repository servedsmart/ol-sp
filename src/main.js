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

document.addEventListener("DOMContentLoaded", () => {
  const config = window.olSimplePointConfig;

  const mapId = config.mapId;
  const iconId = config.iconId;
  const popupId = config.popupId;

  const extraCopyrightURL = config.extraCopyrightURL;
  const extraCopyrightName = config.extraCopyrightName;

  const tileBaseURL = config.tileBaseURL;

  const mapHeight = config.mapHeight;
  const mapWidth = config.mapWidth;

  const centerX = config.centerX;
  const centerY = config.centerY;
  const zoom = config.zoom;
  const minZoom = config.minZoom;
  const maxZoom = config.maxZoom;

  const pointX = config.pointX;
  const pointY = config.pointY;

  const stylesheet = config.stylesheet;
  const stylesheetHash = config.stylesheetHash;
  if (stylesheet) {
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
  mapElement.style.maxHeight = "100vh";
  mapElement.style.height = mapHeight;
  mapElement.style.maxWidth = "80vw";
  mapElement.style.width = mapWidth;
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
    positioning: "center-center",
    position: fromLonLat([pointX, pointY]),
    stopEvent: false,
  });
  map.addOverlay(iconOverlay);

  // Initialize popupOverlay and add to map

  const popupElement = document.getElementById(popupId);

  if (popupElement.innerHTML === "") {
    return;
  }
  const popupOverlay = new Overlay({
    element: popupElement,
    positioning: "bottom-center",
    offset: [0, -60],
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
});
