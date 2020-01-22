export class MapTile {
    id: number;
    posX: number;
    posY: number;
    type: string;
    redAlwaysRevealed: boolean;
    greenAlwaysRevealed: boolean;
    blueAlwaysRevealed: boolean;
    structure: string;
    fightId: number;
    fightIcon: string;
    fightRepeatable: boolean;
    portalToMapId: number;
    buildingType: string;
}