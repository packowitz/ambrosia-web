import {Gear} from './gear.model';
import {JewelType} from '../services/enum.service';

export class MerchantPlayerItem {
    id: number;
    playerId: number;
    sortOrder: number;
    merchantLevel: number;
    sold: boolean;
    priceType: string;
    priceAmount: number;
    resourceType: string;
    resourceAmount: number;
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