import {Gear} from './gear.model';
import {JewelType} from '../services/enum.service';

export class LootableItem {
    resourceType: string;
    resourceAmount: number;
    progressStat: string;
    progressBonus: number;
    heroBaseId: number;
    heroLevel: number;
    gear: Gear;
    jewelType: JewelType;
    jewelLevel: number;
    vehicleBaseId: number;
    vehiclePartType: string;
    vehiclePartQuality: string;
    secondsUntilRefresh: number;
}