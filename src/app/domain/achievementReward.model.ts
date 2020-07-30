import {LootedItem} from '../services/backend.service';

export class AchievementReward {
    id: number;
    starter: boolean;
    name: string;
    achievementType: string;
    achievementAmount: number;
    followUpReward: number;
    lootBoxId: number;

    // transient. only for player view
    reward: LootedItem[];
}