import {LootedItem} from '../services/backend.service';

export class OddJob {
    id: number;
    playerId: number;
    oddJobBaseId: number;
    level: number;
    name: string;
    rarity: string;
    jobType: string;
    jobAmount: number;
    jobAmountDone: number;
    reward: LootedItem[];
}