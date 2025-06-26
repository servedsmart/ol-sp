/*
 * File: config.js
 * Author: Leopold Meinel (leo@meinel.dev)
 * -----
 * Copyright (c) 2025 Leopold Meinel & contributors
 * SPDX ID: MIT
 * URL: https://opensource.org/licenses/MIT
 * -----
 */

const script = document.currentScript;

const mapId = script?.getAttribute("data-map-id");
const iconId = script?.getAttribute("data-icon-id");
const popupId = script?.getAttribute("data-popup-id");

const stylesheet = script?.getAttribute("data-stylesheet");
const stylesheetHash = script?.getAttribute("data-stylesheet-hash");

const extraCopyrightURL = script?.getAttribute("data-extra-copyright-url");
const extraCopyrightName = script?.getAttribute("data-extra-copyright-name");

const tileBaseURL = script?.getAttribute("data-tile-base-url");

const mapIsSquare = script?.getAttribute("data-map-is-square") === "true";
const mapHeight = script?.getAttribute("data-map-height");
const mapWidth = script?.getAttribute("data-map-width");

const centerX = parseFloat(script?.getAttribute("data-center-x"));
const centerY = parseFloat(script?.getAttribute("data-center-y"));
const zoom = parseInt(script?.getAttribute("data-zoom"));
const minZoom = parseInt(script?.getAttribute("data-min-zoom"));
const maxZoom = parseInt(script?.getAttribute("data-max-zoom"));

const pointX = parseFloat(script?.getAttribute("data-point-x"));
const pointY = parseFloat(script?.getAttribute("data-point-y"));

window.olSimplePointConfig = {
  mapId: mapId,
  iconId: iconId,
  popupId: popupId,
  stylesheet: stylesheet,
  stylesheetHash: stylesheetHash,
  extraCopyrightURL: extraCopyrightURL,
  extraCopyrightName: extraCopyrightName,
  tileBaseURL: tileBaseURL,
  mapIsSquare: mapIsSquare,
  mapHeight: mapHeight,
  mapWidth: mapWidth,
  centerX: centerX,
  centerY: centerY,
  zoom: zoom,
  minZoom: minZoom,
  maxZoom: maxZoom,
  pointX: pointX,
  pointY: pointY,
};
