import { Point } from "pixi.js";
import { GridType, SceneController } from "./SceneController";

export function snap(this: SceneController, dropPoint: Point ): Point {
  let x, y: number;
  switch(this.gridType) {
    case GridType.None:
      return dropPoint;
    case GridType.Squares:
      // TODO - handle larger objects
      x = Math.round((dropPoint.x - (this.gridSize / 2)) / this.gridSize) * this.gridSize + (this.gridSize / 2);
      y = Math.round((dropPoint.y - (this.gridSize / 2)) / this.gridSize) * this.gridSize + (this.gridSize / 2);
      return new Point(x, y);
    case GridType.HorizontalHex:
    case GridType.VerticalHex:
    default:
      return dropPoint;
  }
}
