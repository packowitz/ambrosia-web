import {LootableItem} from './lootableItem.model';

export class BlackMarketItem {
    id: number;
    active: boolean;
    sortOrder: number;
    lootBoxId: number;
    priceType: string;
    priceAmount: number;

    lootableItem: LootableItem;
}