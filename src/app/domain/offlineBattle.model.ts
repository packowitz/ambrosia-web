import {LootedItem} from '../services/backend.service';

export class OfflineBattle {
    battleId: number;
    battleFinished: boolean;
    battleStarted: boolean;

    duration: number;
    secondsUntilDone: number;
    battleSuccess: boolean;
    cancelled: boolean;

    lootedItems?: LootedItem[];
}