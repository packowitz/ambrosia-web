import {PlayerMapTile} from './playerMapTile.model';

export class PlayerMap {
    mapId: number;
    name: string;
    type: string;
    background: string;
    discoverySteamCost: number;
    storyTrigger: string;
    favorite: boolean;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    secondsToReset?: number;

    tiles: PlayerMapTile[];
}