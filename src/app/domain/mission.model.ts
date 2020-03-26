import {Fight} from './fight.model';
import {OfflineBattle} from './offlineBattle.model';

export class Mission {
    id: number;
    playerId: number;
    fight: Fight;
    vehicleId: number;
    slotNumber: number;
    hero1Id: number;
    hero2Id: number;
    hero3Id: number;
    hero4Id: number;
    totalCount: number;
    wonCount: number;
    lostCount: number;

    lootCollected: boolean;
    missionFinished: boolean;
    nextUpdateSeconds: number;
    duration: number;
    secondsUntilDone: number;

    battles: OfflineBattle[];

    // transient
    updating: boolean;
}