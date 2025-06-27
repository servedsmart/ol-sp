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

import { defaults as defaultControls } from "ol/control/defaults.js";
import { fromLonLat } from "ol/proj";
import Control from "ol/control/Control";
import Map from "ol/Map.js";
import OSM, { ATTRIBUTION } from "ol/source/OSM.js";
import Overlay from "ol/Overlay.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";

// Custom control to set center
class CenterControl extends Control {
  constructor({ target, center, element, button } = {}) {
    super({
      element,
      target,
    });

    this.center = center;
    button.addEventListener("click", () => {
      this.handlePan();
    });
  }

  handlePan() {
    this.getMap().getView().setCenter(this.center);
  }
}

// Load stylesheet
function loadStylesheet(stylesheet, stylesheetHash) {
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
}

// Initialize TileLayer that gets tiles from tileBaseURL
function getTilelayer(attributions, url) {
  return new TileLayer({
    source: new OSM({
      attributions,
      crossOrigin: "",
      url,
    }),
  });
}

// Get icon overlay
function getIconOverlay(element, position) {
  return new Overlay({
    element,
    position,
    positioning: "bottom-center",
    stopEvent: false,
  });
}

// Initialize popup overlay
function getPopupOverlay(element, offset) {
  return new Overlay({
    element,
    offset,
    positioning: "bottom-center",
    stopEvent: false,
  });
}

window.olSp = (config) => {
  const {
    mapId,
    centerControlId,
    centerControlButtonId,
    iconId,
    popupId,
    stylesheet,
    stylesheetHash,
    extraCopyrightURL,
    extraCopyrightName,
    tileBaseURL,
    height,
    width,
    centerX,
    centerY,
    zoom,
    minZoom,
    maxZoom,
    pointX,
    pointY,
    iconSize,
  } = config;

  // Load stylesheet
  loadStylesheet(stylesheet, stylesheetHash);

  // Initialize tileLayer
  const customAttribution =
    extraCopyrightURL && extraCopyrightName
      ? "&#169; " +
        `<a href="${extraCopyrightURL}" target="_blank">${extraCopyrightName}</a> ` +
        "contributors."
      : "";
  const tileLayer = getTilelayer([customAttribution + ATTRIBUTION], `${tileBaseURL}/{z}/{x}/{y}.png`);

  // Initialize mapElement
  const mapElement = document.getElementById(mapId);
  mapElement.style.height = height ? height : width;
  mapElement.style.width = width ? width : height;

  // Initialize map
  const view = new View({
    center: fromLonLat([centerX, centerY]),
    maxZoom,
    minZoom,
    zoom,
  });
  const centerControl = new CenterControl({
    button: document.getElementById(centerControlButtonId),
    center: fromLonLat([centerX, centerY]),
    element: document.getElementById(centerControlId),
  });
  const map = new Map({
    controls: defaultControls().extend([centerControl]),
    layers: [tileLayer],
    target: mapElement,
    view,
  });

  // Initialize iconElement
  const iconElement = document.getElementById(iconId);
  if (!iconElement) {
    return;
  }
  iconElement.style.height = iconSize;
  iconElement.style.width = iconSize;
  iconElement.style.display = "block";

  // Initialize iconOverlay and add to map
  const iconOverlay = getIconOverlay(iconElement, fromLonLat([pointX, pointY]));
  map.addOverlay(iconOverlay);

  // Initialize popupElement
  const popupElement = document.getElementById(popupId);
  if (!popupElement.innerHTML.trim()) {
    return;
  }
  popupElement.style.display = "block";

  // Initialize popupOverlay and add to map
  const popupOffsetY = -1.2 * parseInt(iconSize);
  const popupOverlay = getPopupOverlay(popupElement, [0, popupOffsetY]);
  popupOverlay.setPosition(undefined);
  map.addOverlay(popupOverlay);

  // Add event listeners
  iconElement.addEventListener("click", (event) => {
    event.stopPropagation();
    popupOverlay.setPosition(iconOverlay.getPosition());
  });
  map.on("movestart", () => popupOverlay.setPosition(undefined));
  map.on("click", () => popupOverlay.setPosition(undefined));
};
