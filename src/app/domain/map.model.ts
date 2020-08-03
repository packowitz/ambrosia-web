import {MapTile} from './mapTile.model';

export class Map {
    id: number;
    name: string;
    type: string;
    startingMap: boolean;
    storyTrigger: string;
    discoverySteamCost: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    background: string;
    resetIntervalHours?: number;
    intervalFrom?: string;
    intervalTo?: string;
    tiles: MapTile[];
}