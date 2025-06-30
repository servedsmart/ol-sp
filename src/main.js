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
      this.handlePan();
    });
  }

  handlePan() {
    this.getMap().getView().setCenter(this.center);
  }
}

/**
 * Load a stylesheet and make sure it is not loaded twice.
 * @param {string} stylesheet href to the stylesheet to add.
 * @param {string | undefined} stylesheetHash Integrity hash of the stylesheet.
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
 * Get a `TileLayer` with an `OSM` source.
 * @param {import("ol/source/Source").AttributionLike | undefined} attributions Attributions for the `OSM` source. Takes HTML code.
 * @param {string | undefined} url URL to source the `OSM` from.
 * @returns {TileLayer<OSM>} A `TileLayer` with an `OSM` source from specified parameters.
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
 * @param {string} config.mapId The id of the map element.
 * @param {string | undefined} config.centerControlId The id of the `CenterControl` element.
 * @param {string | undefined} config.centerControlButtonId The id of the `CenterControl` button element.
 * @param {string | undefined} config.iconId The id of the icon element.
 * @param {string | undefined} config.popupId The id of the popup element.
 * @param {string | undefined} config.stylesheet The stylesheet to load.
 * @param {string | undefined} config.stylesheetHash The hash of the stylesheet to load.
 * @param {string | undefined} config.extraCopyrightURL The URL for an extra copyright attribution.
 * @param {string | undefined} config.extraCopyrightName The name of the extra copyright attribution.
 * @param {string} config.tileBaseURL The URL for the OSM tile server.
 * @param {string} config.height The height of the map element.
 * @param {string} config.width The width of the map element.
 * @param {number} config.centerX The X coordinate (longitude) for the center of the map.
 * @param {number} config.centerY The Y coordinate (latitude) for the center of the map.
 * @param {number} config.zoom The default zoom level. Valid ranges are `0-20`. See https://wiki.openstreetmap.org/wiki/Zoom_levels.
 * @param {number} config.minZoom The minimum zoom level. Valid ranges are `0-20`. See https://wiki.openstreetmap.org/wiki/Zoom_levels.
 * @param {number} config.maxZoom The maximum zoom level. Valid ranges are `0-20`. See https://wiki.openstreetmap.org/wiki/Zoom_levels.
 * @param {number | undefined} config.pointX The X coordinate (longitude) for the position of the point.
 * @param {number | undefined} config.pointY The Y coordinate (latitude) for the position of the point.
 * @param {string | undefined} config.iconSize The size of the icon element.
 */
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

  loadStylesheet(stylesheet, stylesheetHash);

  // Initialize tileLayer
  const customAttribution =
    extraCopyrightURL && extraCopyrightName
      ? "&#169; " +
        `<a href="${extraCopyrightURL}" target="_blank">${extraCopyrightName}</a> ` +
        "contributors."
      : "";
  const tileLayer = getTilelayer([customAttribution + ATTRIBUTION], `${tileBaseURL}/{z}/{x}/{y}.png`);

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
