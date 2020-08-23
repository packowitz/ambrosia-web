import {JewelType} from "../services/enum.service";

export class InboxMessageItem {
    id: number;
    number: number;
    type: string;
    resourceType?: string;
    resourceAmount?: number;
    heroBaseId?: number;
    heroLevel?: number;
    jewelType?: JewelType;
    jewelLevel?: number;
    vehicleBaseId?: number;
    vehiclePartType?: string;
    vehiclePartQuality?: string;
    progressStat?: string;
    progressBonus?: number;
}