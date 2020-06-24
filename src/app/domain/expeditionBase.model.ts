import {LootBox} from './lootBox.model';

export class ExpeditionBase {
    id: number;
    name: string;
    description: string;
    level: number;
    rarity: string;
    durationMinutes: number;
    lootBox: LootBox;
}