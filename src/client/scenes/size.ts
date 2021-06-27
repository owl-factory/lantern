import { PIXELS_PER_HEX, PIXELS_PER_SQUARE } from "./consts";
import { SceneController, MapSizeUnit } from "./SceneController";

/**
 * Fetches the map's current height in pixels
 */
export function getMapHeight(this: SceneController): number { return this.mapSize.height; }

/**
 * Fetches the map's current width in pixels
 */
export function getMapWidth(this: SceneController): number { return this.mapSize.width; }
/**
 * Fetches the number of tiles (hexes, squares, pixels) this map is tall
 */
export function getMapUnitHeight(this: SceneController): number { return this.mapSize.height; }
/**
 * Fetches the number of tiles (hexes, squares, pixels) this map is wide
 */
export function getMapUnitWidth(this: SceneController): number { return this.mapSize.width; }
/**
 * Fetches the tile type currently being used
 */
export function getMapUnit(this: SceneController): MapSizeUnit { return this.mapSize.unit; }

/**
 * Sets the new height of the map in pixels
 * @param height The new height of the map, in pixels
 */
export function setMapHeight(this: SceneController, height: number): void {
  this.mapSize.height = this.pixelsToNearestUnit(height);
  this.mapSize.unitHeight = this.pixelsToUnit(this.mapSize.height);
  this.map.height = this.mapSize.height;
}

/**
 * Sets the new width of the map in pixels
 * @param width The width in pixels
 */
export function setMapWidth(this: SceneController, width: number): void {
  this.mapSize.width = this.pixelsToNearestUnit(width);
  this.mapSize.unitWidth = this.pixelsToUnit(this.mapSize.width);
  this.map.width = this.mapSize.width;
}

/**
 * Sets the height of the map for whatever unit is currently being used
 * @param unitHeight The number of units the map will be tall
 */
export function setMapUnitHeight(this: SceneController, unitHeight: number): void {
  this.mapSize.unitHeight = unitHeight;
  this.mapSize.height = this.unitToPixels(unitHeight);
  this.map.height = this.mapSize.height;
}

/**
 * Sets the new width of the map for whatever unit is currently being used
 * @param unitWidth The number of units the map will be wide
 */
export function setMapUnitWidth(this: SceneController, unitWidth: number): void {
  this.mapSize.unitWidth = unitWidth;
  this.mapSize.width = this.unitToPixels(unitWidth);
  this.map.width = this.mapSize.width;
}

/**
 * Change the map unit from one unit to another
 * @param unit The new unit type
 */
export function setMapUnit(this: SceneController, unit: MapSizeUnit): void {
  this.mapSize.unit = unit;
  this.mapSize.height = this.pixelsToNearestUnit(this.mapSize.height);
  this.mapSize.width = this.pixelsToNearestUnit(this.mapSize.width);

  this.mapSize.unitHeight = this.pixelsToUnit(this.mapSize.height);
  this.mapSize.unitWidth = this.pixelsToUnit(this.mapSize.width);
}

/**
 * Sets the default map stuff
 * TODO - remove or rename. Not here
 */
export function setDefaultMap(this: SceneController): void {
  this.setMapUnit(MapSizeUnit.HorizontalHex);
  this.setMapUnitHeight(5);
  this.setMapUnitWidth(5);
}

/**
 * Converts pixels into units.
 * TODO - needs a rework, as hexes are different widths and heights
 * @param pixels The pixels to convert
 */
export function pixelsToUnit(this: SceneController, pixels: number): number {
  switch(this.mapSize.unit) {
    case MapSizeUnit.Squares:
      return Math.round(pixels / PIXELS_PER_SQUARE);
    case MapSizeUnit.VerticalHex:
    case MapSizeUnit.HorizontalHex:
      return Math.round(pixels / PIXELS_PER_HEX); // Check
    case MapSizeUnit.Pixels:
    default:
      return pixels;
  }
}

/**
 * Converts units into pixels
 * TODO - needs a rework, since height and width differ
 * @param units The number of units to convert
 */
export function unitToPixels(this: SceneController, units: number): number {
  switch(this.mapSize.unit) {
    case MapSizeUnit.Squares:
      return units * PIXELS_PER_SQUARE;
    case MapSizeUnit.VerticalHex:
    case MapSizeUnit.HorizontalHex:
      return units * PIXELS_PER_HEX * 0.75;
    case MapSizeUnit.Pixels:
    default:
      return units;
  }
}

/**
 * Converts pixels to the nearest unit. 
 * TODO - this is obviously wrong. 
 * @param pixels The pixels to convert into the nearest unit
 */
export function pixelsToNearestUnit(this: SceneController, pixels: number): number {
  return this.unitToPixels(this.pixelsToUnit(pixels));
}
