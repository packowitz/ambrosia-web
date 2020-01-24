import {MapTile} from './mapTile.model';

export class Map {
    id: number;
    name: string;
    startingMap: boolean;
    discoverySteamCost: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    background: string;
    tiles: MapTile[];
}