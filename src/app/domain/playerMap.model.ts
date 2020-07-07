import {PlayerMapTile} from './playerMapTile.model';

export class PlayerMap {
    mapId: number;
    name: string;
    background: string;
    discoverySteamCost: number;
    storyTrigger: string;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    secondsToReset?: number;

    tiles: PlayerMapTile[];
}