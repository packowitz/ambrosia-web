export class Upgrade {
    id: number;
    playerId: number;
    position: number;
    buildingType: string;
    vehicleId: number;
    vehiclePartId: number;
    jewelType: string;
    jewelLevel: number;
    finished: boolean;
    inProgress: boolean;
    duration: number;
    secondsUntilDone: number;

    // transient
    updating: boolean;
}