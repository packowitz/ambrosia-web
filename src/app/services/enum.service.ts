import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../environments/environment';
import {Observable} from 'rxjs';

export class SkillActionEffect { name: string; type: string; description: string; needTarget: boolean; needDuration: boolean; }
export class PropertyCategory { name: string; levelName: string; value1name: string; showStat: boolean; showProgressStat: boolean; showResources: boolean; showVehicleStat: boolean; showValue2: boolean; value2name: string; }
export class PropertyType { name: string; category: string; description: string; value1name: string; showStat: boolean; showProgressStat: boolean; showResources: boolean; showVehicleStat: boolean; showValue2: boolean; value2name: string; }
export class GearSet { name: string; pieces: number; description: string; }
export class JewelType { name: string; slot: string; gearSet: string; }
export class MapTileStructure { name: string; type: string; }
export class ResourceType { name: string; category: string; }
export class Buff { buffName: string; description: string; type: string; propertyType: string; }

export class Enums {
    colors: string[];
    heroTypes: string[];
    rarities: string[];
    skillActionEffects: SkillActionEffect[];
    skillActionTargets: string[];
    skillActionTriggers: string[];
    skillActionTypes: string[];
    skillActiveTriggers: string[];
    skillTargets: string[];
    propertyCategories: PropertyCategory[];
    propertyTypes: PropertyType[];
    heroStats: string[];
    gearSets: string[];
    gearTypes: string[];
    buffs: Buff[];
    jewelTypes: JewelType[];
    passiveSkillTriggers: string[];
    mapTileTypes: string[];
    mapTileStructures: MapTileStructure[];
    mapTileFightIcons: string[];
    mapBackgrounds: string[];
    fightConfigSpeedbarChanges: string[];
    buildingTypes: string[];
    resourceTypes: ResourceType[];
    partQualities: string[];
    partTypes: string[];
    vehicleStats: string[];
    lootItemTypes: string[];
    modifications: string[];
    storyTriggers: string[];
    progressStats: string[];
    oddJobTypes: string[];
}

@Injectable({
    providedIn: 'root'
})
export class EnumService {

    enumsFailed = false;
    enums: Enums;

    constructor(private http: HttpClient) {}

    loadEnums(): Observable<Enums> {
        return this.http.get<Enums>(API_URL + '/enums');
    }

    getColors(): string[] {
        return this.enums.colors;
    }

    getRarities(): string[] {
        return this.enums.rarities;
    }

    getHeroTypes(): string[] {
        return this.enums.heroTypes;
    }

    getSkillActiveTriggers(): string[] {
        return this.enums.skillActiveTriggers;
    }

    getSkillTargets(): string[] {
        return this.enums.skillTargets;
    }

    getSkillActionTriggers(): string[] {
        return this.enums.skillActionTriggers;
    }

    getSkillActionTypes(): string[] {
        return this.enums.skillActionTypes;
    }

    getSkillActionTargets(): string[] {
        return this.enums.skillActionTargets;
    }

    getSkillActionEffects(): SkillActionEffect[] {
        return this.enums.skillActionEffects;
    }

    getPropertyCategories(): PropertyCategory[] {
        return this.enums.propertyCategories;
    }

    getPropertyTypes(): PropertyType[] {
        return this.enums.propertyTypes;
    }

    getHeroStats(): string[] {
        return this.enums.heroStats;
    }

    getGearSets(): string[] {
        return this.enums.gearSets;
    }

    getGearTypes(): string[] {
        return this.enums.gearTypes;
    }

    getBuffs(): Buff[] {
        return this.enums.buffs;
    }

    getJewelTypes(): JewelType[] {
        return this.enums.jewelTypes;
    }

    getPassiveSkillTriggers(): string[] {
        return this.enums.passiveSkillTriggers;
    }

    getMapTileTypes(): string[] {
        return this.enums.mapTileTypes;
    }

    getMapTileStructures(): MapTileStructure[] {
        return this.enums.mapTileStructures;
    }

    getMapTileFightIcons(): string[] {
        return this.enums.mapTileFightIcons;
    }

    getMapBackgrounds(): string[] {
        return this.enums.mapBackgrounds;
    }

    getFightSpeedbarChanges(): string[] {
        return this.enums.fightConfigSpeedbarChanges;
    }

    getBuildingTypes(): string[] {
        return this.enums.buildingTypes;
    }

    getResourceTypes(): ResourceType[] {
        return this.enums.resourceTypes;
    }

    getPartQualities(): string[] {
        return this.enums.partQualities;
    }

    getPartTypes(): string[] {
        return this.enums.partTypes;
    }

    getVehicleStats(): string[] {
        return this.enums.vehicleStats;
    }

    getLootItemTypes(): string[] {
        return this.enums.lootItemTypes;
    }

    getModifications(): string[] {
        return this.enums.modifications;
    }

    getStoryTriggerns(): string[] {
        return this.enums.storyTriggers;
    }

    getProgressStats(): string[] {
        return this.enums.progressStats;
    }

    getOddJobTypes(): string[] {
        return this.enums.oddJobTypes;
    }
}