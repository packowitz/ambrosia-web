import {MapTile} from './mapTile.model';

export class Map {
    id: number;
    name: string;
    startingMap: boolean;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    tiles: MapTile[];
}