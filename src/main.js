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

import { fromLonLat } from "ol/proj";
import Control from "ol/control/Control";
import Map from "ol/Map.js";
import OSM, { ATTRIBUTION } from "ol/source/OSM.js";
import Overlay from "ol/Overlay.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";

/**
 * @classdesc
 * A Control with a button to set a new center of the view.
 */
class CenterControl extends Control {
  /**
   *
   * @param {*} options Control options. Takes target, center, element and button.
   */
  constructor({ target, center, element, button } = {}) {
    super({
      element,
      target,
    });

    this.element.title = "Center";
    this.center = center;
    button.addEventListener("click", () => {
      this.handlePan();
    });
  }

  handlePan() {
    this.getMap().getView().setCenter(this.center);
  }
}

/**
 * Load a stylesheet and make sure it is not loaded twice.
 * @param {*} stylesheet Href to the stylesheet to add.
 * @param {*} stylesheetHash Integrity hash of the stylesheet.
 */
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

/**
 * Get a TileLayer with an OSM source.
 * @param {*} attributions Attributions for the OSM source. Takes HTML code.
 * @param {*} url URL to source the OSM from.
 * @returns TileLayer with an OSM source.
 */
function getTilelayer(attributions, url) {
  return new TileLayer({
    source: new OSM({
      attributions,
      crossOrigin: "",
      url,
    }),
  });
}

/**
 * Add a CenterControl to the target map.
 * @param {*} button Button element to use in CenterControl.
 * @param {*} element Element to use in CenterControl.
 * @param {*} map Target map.
 * @param {*} center Center to use in CenterControl.
 */
function handleCenterControl(button, element, map, center) {
  const centerControl = new CenterControl({
    button,
    center,
    element,
  });
  map.addControl(centerControl);
  // NOTE: This is necessary to ensure that a dynamic style applied via '.ol-touch .ol-control button'
  //       is compatible with our CSS for ol-sp-center-control's top using em
  map.on("postrender", () => {
    const fontSize = window.getComputedStyle(button).fontSize;
    element.style.fontSize = fontSize;
    button.style.fontSize = "inherit";
    element.style.display = "block";
    button.style.display = "block";
  });
}

/**
 * Get Overlay with specific properties that are suitable for point icons.
 * @param {*} element Element containing the icon.
 * @param {*} position Position of the new Overlay.
 * @returns Overlay with specific properties that are suitable for point icons.
 */
function getIconOverlay(element, position) {
  return new Overlay({
    element,
    position,
    positioning: "bottom-center",
    stopEvent: false,
  });
}

/**
 * Get Overlay with specific properties that are suitable for popups.
 * @param {*} element Element containing text for the popup.
 * @param {*} offset Offset to move the Overlay.
 * @returns Overlay with specific properties that are suitable for popups.
 */
function getPopupOverlay(element, offset) {
  return new Overlay({
    element,
    offset,
    positioning: "bottom-center",
    stopEvent: false,
  });
}

window.olSp = (config) => {
  // FIXME: Make most of these optional
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
  const map = new Map({
    layers: [tileLayer],
    target: mapElement,
    view,
  });

  // Add CenterControl element
  const centerControlButtonElement = document.getElementById(centerControlButtonId);
  const centerControlElement = document.getElementById(centerControlId);
  if (centerControlButtonElement && centerControlElement) {
    handleCenterControl(centerControlButtonElement, centerControlElement, map, fromLonLat([centerX, centerY]));
  }

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
