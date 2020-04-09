export class Building {
    id: number;
    playerId: number;
    type: string;
    level: number;
    upgradeTriggered: boolean;
    upgradeStarted?: string;
    upgradeFinished?: string;
}