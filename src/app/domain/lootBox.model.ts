import {LootItem} from './lootItem.model';

export class LootBox {
    id?: number;
    name: string;
    type: string;
    items?: LootItem[];
}