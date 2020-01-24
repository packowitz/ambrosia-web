import {PlayerMapTile} from './playerMapTile.model';

export class PlayerMap {
    mapId: number;
    name: string;
    background: string;
    discoverySteamCost: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;

    tiles: PlayerMapTile[];
}