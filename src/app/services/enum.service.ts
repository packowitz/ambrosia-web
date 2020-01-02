import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../environments/environment';

export class SkillActionEffect { name: string; type: string; description: string; }
export class PropertyType { name: string; category: string; description: string; }
export class GearSet { name: string; pieces: number; description: string; }
export class JewelType { name: string; slot: string; gearSet: string; }

@Injectable({
    providedIn: 'root'
})
export class EnumService {

    private colors: string[] = [];
    private rarities: string[] = [];
    private heroTypes: string[] = [];
    private skillActiveTriggers: string[] = [];
    private skillTargets: string[] = [];
    private skillActionTriggers: string[] = [];
    private skillActionTypes: string[] = [];
    private skillActionTargets: string[] = [];
    private skillActionEffects: SkillActionEffect[] = [];
    private propertyCategories: string[] = [];
    private propertyTypes: PropertyType[] = [];
    private heroStats: string[] = [];
    private gearSets: string[] = [];
    private jewelTypes: JewelType[] = [];
    private passiveSkillTriggers: string[] = [];
    private mapTileTypes: string[] = [];
    private mapTileStructures: string[] = [];
    private mapTileFightIcons: string[] = [];

    constructor(private http: HttpClient) {
        this.http.get(API_URL + '/enum/colors').subscribe((data: string[]) => this.colors = data);
        this.http.get(API_URL + '/enum/rarities').subscribe((data: string[]) => this.rarities = data);
        this.http.get(API_URL + '/enum/hero_types').subscribe((data: string[]) => this.heroTypes = data);
        this.http.get(API_URL + '/enum/skill_active_triggers').subscribe((data: string[]) =>
            this.skillActiveTriggers = data);
        this.http.get(API_URL + '/enum/skill_targets').subscribe((data: string[]) => this.skillTargets = data);
        this.http.get(API_URL + '/enum/skill_action_triggers').subscribe((data: string[]) =>
            this.skillActionTriggers = data);
        this.http.get(API_URL + '/enum/skill_action_types').subscribe((data: string[]) =>
            this.skillActionTypes = data);
        this.http.get(API_URL + '/enum/skill_action_targets').subscribe((data: string[]) =>
            this.skillActionTargets = data);
        this.http.get(API_URL + '/enum/skill_action_effects').subscribe((data: SkillActionEffect[]) =>
            this.skillActionEffects = data);
        this.http.get(API_URL + '/enum/property_categories').subscribe((data: string[]) =>
            this.propertyCategories = data);
        this.http.get(API_URL + '/enum/property_types').subscribe((data: PropertyType[]) =>
            this.propertyTypes = data);
        this.http.get(API_URL + '/enum/hero_stats').subscribe((data: string[]) =>
            this.heroStats = data);
        this.http.get(API_URL + '/enum/gear_sets').subscribe((data: string[]) =>
            this.gearSets = data);
        this.http.get(API_URL + '/enum/jewel_types').subscribe((data: JewelType[]) =>
            this.jewelTypes = data);
        this.http.get(API_URL + '/enum/passive_skill_triggers').subscribe((data: string[]) =>
            this.passiveSkillTriggers = data);
        this.http.get(API_URL + '/enum/map_tile_types').subscribe((data: string[]) =>
            this.mapTileTypes = data);
        this.http.get(API_URL + '/enum/map_tile_structures').subscribe((data: string[]) =>
            this.mapTileStructures = data);
        this.http.get(API_URL + '/enum/map_tile_fight_icons').subscribe((data: string[]) =>
            this.mapTileFightIcons = data);
    }

    getColors(): string[] {
        return this.colors;
    }

    getRarities(): string[] {
        return this.rarities;
    }

    getHeroTypes(): string[] {
        return this.heroTypes;
    }

    getSkillActiveTriggers(): string[] {
        return this.skillActiveTriggers;
    }

    getSkillTargets(): string[] {
        return this.skillTargets;
    }

    getSkillActionTriggers(): string[] {
        return this.skillActionTriggers;
    }

    getSkillActionTypes(): string[] {
        return this.skillActionTypes;
    }

    getSkillActionTargets(): string[] {
        return this.skillActionTargets;
    }

    getSkillActionEffects(): SkillActionEffect[] {
        return this.skillActionEffects;
    }

    getPropertyCategories(): string[] {
        return this.propertyCategories;
    }

    getPropertyTypes(): PropertyType[] {
        return this.propertyTypes;
    }

    getHeroStats(): string[] {
        return this.heroStats;
    }

    getGearSets(): string[] {
        return this.gearSets;
    }

    getJewelTypes(): JewelType[] {
        return this.jewelTypes;
    }

    getPassiveSkillTriggers(): string[] {
        return this.passiveSkillTriggers;
    }

    getMapTileTypes(): string[] {
        return this.mapTileTypes;
    }

    getMapTileStructures(): string[] {
        return this.mapTileStructures;
    }

    getMapTileFightIcons(): string[] {
        return this.mapTileFightIcons;
    }
}