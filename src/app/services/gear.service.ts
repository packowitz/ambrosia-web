import {Injectable} from '@angular/core';
import {Model} from './model.service';
import {Gear} from '../domain/gear.model';


@Injectable({
    providedIn: 'root'
})
export class GearService {

    constructor(private model: Model) {}

    autoBreakdown(gear: Gear): boolean {
        if (this.model.progress.autoBreakDownEnabled) {
            let conf = this.model.autoBreakdownConfiguration;
            switch (gear.rarity) {
                case 'SIMPLE': return this.getNumberOfJewels(gear) < conf.simpleMinJewelSlots || this.gearQualityToNumber(gear.gearQuality) < conf.simpleMinQuality;
                case 'COMMON': return this.getNumberOfJewels(gear) < conf.commonMinJewelSlots || this.gearQualityToNumber(gear.gearQuality) < conf.commonMinQuality;
                case 'UNCOMMON': return this.getNumberOfJewels(gear) < conf.uncommonMinJewelSlots || this.gearQualityToNumber(gear.gearQuality) < conf.uncommonMinQuality;
                case 'RARE': return this.getNumberOfJewels(gear) < conf.rareMinJewelSlots || this.gearQualityToNumber(gear.gearQuality) < conf.rareMinQuality;
                case 'EPIC': return this.getNumberOfJewels(gear) < conf.epicMinJewelSlots || this.gearQualityToNumber(gear.gearQuality) < conf.epicMinQuality;
                case 'LEGENDARY': return this.getNumberOfJewels(gear) < conf.legendaryMinJewelSlots || this.gearQualityToNumber(gear.gearQuality) < conf.legendaryMinQuality;
            }
        }
        return false;
    }

    getNumberOfJewels(gear: Gear): number {
        if (gear.jewelSlot4) { return 4; }
        if (gear.jewelSlot3) { return 3; }
        if (gear.jewelSlot2) { return 2; }
        if (gear.jewelSlot1) { return 1; }
        return 0;
    }

    gearQualityToNumber(quality: string): number {
        switch (quality) {
            case 'SHABBY': return 1;
            case 'RUSTY': return 2;
            case 'ORDINARY': return 3;
            case 'USEFUL': return 4;
            case 'GOOD': return 5;
            case 'AWESOME': return 6;
            case 'FLAWLESS': return 7;
            case 'PERFECT': return 8;
            case 'GODLIKE': return 9;
        }
        return 0;
    }
}
