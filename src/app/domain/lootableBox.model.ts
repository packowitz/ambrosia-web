import {LootableItem} from './lootableItem.model';

export class LootableBox {
    type: string;
    lootBoxId: number;
    items?: LootableItem[];
}