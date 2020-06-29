import {LootedItem} from '../services/backend.service';

export class PlayerExpedition {
    id: number;
    playerId: number;
    expeditionId: number;
    vehicleId: number;
    hero1Id: number;
    hero2Id: number;
    hero3Id: number;
    hero4Id: number;
    completed: boolean;
    name: string;
    description: string;
    level: number;
    rarity: string;

    lootedItems?: LootedItem[];
    duration: number;
    secondsUntilDone: number;
}