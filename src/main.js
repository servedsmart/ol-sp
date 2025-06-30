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

import Control from "ol/control/Control";
import TileLayer from "ol/layer/Tile.js";
import Map from "ol/Map.js";
import Overlay from "ol/Overlay.js";
import { fromLonLat } from "ol/proj";
import OSM, { ATTRIBUTION } from "ol/source/OSM.js";
import View from "ol/View.js";

/**
 * @classdesc
 * A `Control` with a button to set a new center of the view.
 */
class CenterControl extends Control {
  /**
   *
   * @param {Object} config Configuration `Object`.
   * @param {string | HTMLElement | undefined} config.target The target of the `Control`.
   * @param {import("ol/coordinate").Coordinate | undefined} config.center The center that should be set for the `View` of the `Map`.
   * @param {HTMLElement | undefined} config.element The element that is used as `Control`.
   * @param {HTMLElement | undefined} config.button The button element that is used as `Control`.
   */
  constructor({ target, center, element, button } = {}) {
    super({
      element,
      target,
    });

    this.element.title = "Center";
    this.center = center;
    button.addEventListener("click", () => {
      this.setCenter();
    });
  }

  setCenter() {
    this.getMap().getView().setCenter(this.center);
  }
}

/**
 * Add a style sheet if it is not part of the documents `styleSheets`.
 * @param {string} href href to the style sheet to add.
 * @param {string | undefined} hash Integrity hash of the style sheet.
 */
function addStyleSheet(href, hash) {
  const documentStyleSheets = Array.from(document.styleSheets);
  const hrefs = [href, new URL(href, window.location.origin).toString()];
  if (!href || documentStyleSheets.some((styleSheet) => hrefs.includes(styleSheet.href))) {
    return;
  }

  const link = Object.assign(document.createElement("link"), {
    rel: "stylesheet",
    href,
  });
  hash && (link.integrity = hash);
  document.head.appendChild(link);
}

/**
 * Get a `TileLayer` with an `OSM` source.
 * @param {import("ol/source/Source").AttributionLike | undefined} attributions Attributions for the `OSM` source. Takes HTML code.
 * @param {string | undefined} url URL to source the `OSM` from.
 * @returns {TileLayer<OSM>} A `TileLayer` with an `OSM` source from specified parameters.
 */
function getTileLayer(attributions, url) {
  return new TileLayer({
    source: new OSM({
      attributions,
      crossOrigin: "",
      url,
    }),
  });
}

/**
 * Get `Map` and apply styling.
 * @param {string | HTMLElement | undefined} target The target of the `Map`.
 * @param {string | undefined} height The height of the `Map` element.
 * @param {string | undefined} width The width of the `Map` element.
 * @param {import("ol/coordinate").Coordinate | undefined} center The center of the `View`.
 * @param {number | undefined} maxZoom The maximum zoom of the `View`.
 * @param {number | undefined} minZoom The minimum zoom of the `View`.
 * @param {number | undefined} zoom The default zoom of the `View`.
 * @param {BaseLayer[] | Collection<BaseLayer> | LayerGroup | undefined} layers The layers of the `Map`.
 * @returns {Map} A `Map` with a `View` from specified parameters.
 */
function getStyledMap(target, height, width, center, maxZoom, minZoom, zoom, layers) {
  target.style.height = height ? height : width;
  target.style.width = width ? width : height;

  const view = new View({
    center,
    maxZoom,
    minZoom,
    zoom,
  });

  return new Map({
    layers,
    target,
    view,
  });
}

/**
 * Get `CenterControl` and apply styling.
 * @param {HTMLElement} button Button element to use in `CenterControl`.
 * @param {HTMLElement} element Element to use in `CenterControl`.
 * @param {import("ol/coordinate").Coordinate} center Center for a `View` of a `Map` to use in `CenterControl`.
 * @returns {CenterControl} A `CenterControl` with specified parameters.
 */
function getStyledCenterControl(button, element, center) {
  button.style.display = "block";
  element.style.display = "block";

  return new CenterControl({
    button,
    center,
    element,
  });
}

/**
 * Get `Overlay` with specific properties that are suitable for point icons and apply styling.
 * @param {string} iconSize Size of the icon.
 * @param {HTMLElement | undefined} element Element containing the icon.
 * @param {import("ol/coordinate").Coordinate | undefined} position Position of the new `Overlay`.
 * @returns {Overlay} An `Overlay` with specified parameters.
 */
function getStyledIconOverlay(iconSize, element, position) {
  const length = iconSize;
  element.style.height = length;
  element.style.width = length;
  element.style.display = "block";

  return new Overlay({
    element,
    position,
    positioning: "bottom-center",
    stopEvent: false,
  });
}

/**
 * Get `Overlay` with specific properties that are suitable for popups and apply styling.
 * @param {HTMLElement | undefined} element Element containing text for the popup.
 * @param {number[] | undefined} offset Offset to move the `Overlay`.
 * @returns {Overlay} An Overlay with specified parameters.
 */
function getStyledPopupOverlay(element, offset) {
  element.style.display = "block";

  const overlay = new Overlay({
    element,
    offset,
    positioning: "bottom-center",
    stopEvent: false,
  });
  overlay.setPosition(undefined);

  return overlay;
}

/**
 *
 * @param {Object} config Configuration `Object`.
 * @param {string | undefined} [config.mapId = "ol-sp-map"] The id of the map element.
 * @param {string | undefined} [config.centerControlId = "ol-sp-center-control"] The id of the `CenterControl` element.
 * @param {string | undefined} [config.centerControlButtonId = "ol-sp-center-control-button"] The id of the `CenterControl` button element.
 * @param {string | undefined} [config.iconId = "ol-sp-icon"] The id of the icon element.
 * @param {string | undefined} [config.popupId = "ol-sp-popup"] The id of the popup element.
 * @param {string | undefined} [config.styleSheetHref = "ol-sp.min.css"] The href of the stylesheet to load.
 * @param {string | undefined} [config.styleSheetHash] The hash of the stylesheet to load.
 * @param {string | undefined} [config.extraCopyrightURL] The URL for an extra copyright attribution.
 * @param {string | undefined} [config.extraCopyrightName] The name of the extra copyright attribution.
 * @param {string | undefined} [config.tileBaseURL = "https://tile.openstreetmap.org"] The URL for the OSM tile server.
 * @param {string | undefined} [config.height = "100%"] The height of the map element.
 * @param {string | undefined} [config.width = "100%"] The width of the map element.
 * @param {number | undefined} [config.centerX = 0] The X coordinate (longitude) for the center of the `Map`.
 * @param {number | undefined} [config.centerY = 0] The Y coordinate (latitude) for the center of the `Map`.
 * @param {number | undefined} [config.zoom = 0] The default zoom level. Valid ranges are `0-20`. See https://wiki.openstreetmap.org/wiki/Zoom_levels.
 * @param {number | undefined} [config.minZoom = 0] The minimum zoom level. Valid ranges are `0-20`. See https://wiki.openstreetmap.org/wiki/Zoom_levels.
 * @param {number | undefined} [config.maxZoom = 20] The maximum zoom level. Valid ranges are `0-20`. See https://wiki.openstreetmap.org/wiki/Zoom_levels.
 * @param {number | undefined} [config.pointX = 0] The X coordinate (longitude) for the position of the point.
 * @param {number | undefined} [config.pointY = 0] The Y coordinate (latitude) for the position of the point.
 * @param {string | undefined} [config.iconSize = "64px"] The size of the icon element.
 */
window.olSp = (config) => {
  const {
    mapId = "ol-sp-map",
    centerControlId = "ol-sp-center-control",
    centerControlButtonId = "ol-sp-center-control-button",
    iconId = "ol-sp-icon",
    popupId = "ol-sp-popup",
    styleSheetHref = "ol-sp.min.css",
    styleSheetHash,
    extraCopyrightURL,
    extraCopyrightName,
    tileBaseURL = "https://tile.openstreetmap.org",
    height = "100%",
    width = "100%",
    centerX = 0,
    centerY = 0,
    zoom = 0,
    minZoom = 0,
    maxZoom = 20,
    pointX = 0,
    pointY = 0,
    iconSize = "64px",
  } = config;

  addStyleSheet(styleSheetHref, styleSheetHash);

  // Initialize tileLayer
  const customAttribution =
    extraCopyrightURL && extraCopyrightName
      ? "&#169; " +
        `<a href="${extraCopyrightURL}" target="_blank">${extraCopyrightName}</a> ` +
        "contributors."
      : "";
  const tileLayer = getTileLayer([customAttribution + ATTRIBUTION], `${tileBaseURL}/{z}/{x}/{y}.png`);

  // Initialize map
  const mapElement = document.getElementById(mapId);
  const map = getStyledMap(mapElement, height, width, fromLonLat([centerX, centerY]), maxZoom, minZoom, zoom, [
    tileLayer,
  ]);

  // Add CenterControl element
  const centerControlButtonElement = document.getElementById(centerControlButtonId);
  const centerControlElement = document.getElementById(centerControlId);
  if (centerControlButtonElement && centerControlElement) {
    const centerControl = getStyledCenterControl(
      centerControlButtonElement,
      centerControlElement,
      fromLonLat([centerX, centerY]),
    );
    map.addControl(centerControl);
  }

  // Initialize iconOverlay and add to map
  const iconElement = document.getElementById(iconId);
  if (!iconElement) {
    return;
  }
  const iconOverlay = getStyledIconOverlay(iconSize, iconElement, fromLonLat([pointX, pointY]));
  map.addOverlay(iconOverlay);

  // Initialize popupOverlay and add to map
  const popupElement = document.getElementById(popupId);
  if (!popupElement.innerHTML.trim()) {
    return;
  }
  const popupOffsetY = -1.2 * parseInt(iconSize);
  const popupOverlay = getStyledPopupOverlay(popupElement, [0, popupOffsetY]);
  map.addOverlay(popupOverlay);

  // Add event listeners to iconElement and map
  iconElement.addEventListener("click", (event) => {
    event.stopPropagation();
    popupOverlay.setPosition(iconOverlay.getPosition());
  });
  map.on("movestart", () => popupOverlay.setPosition(undefined));
  map.on("click", () => popupOverlay.setPosition(undefined));
};
