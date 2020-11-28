import {LootedItem} from "../services/backend.service";

export class Task {
    id: number;
    number: number;
    taskType: string;
    taskAmount: number;
    lootBoxId: number;

    // transient. only for player view
    reward: LootedItem[];
}
