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

    enumsLoaded = 0;
    enumsTotal = 19;
    enumsFailed = false;

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
    private mapBackgrounds: string[] = [];

    constructor(private http: HttpClient) {
        this.http.get(API_URL + '/enum/colors').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.colors = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/rarities').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.rarities = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/hero_types').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.heroTypes = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/skill_active_triggers').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.skillActiveTriggers = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/skill_targets').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.skillTargets = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/skill_action_triggers').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.skillActionTriggers = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/skill_action_types').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.skillActionTypes = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/skill_action_targets').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.skillActionTargets = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/skill_action_effects').subscribe((data: SkillActionEffect[]) => {
            this.enumsLoaded ++;
            this.skillActionEffects = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/property_categories').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.propertyCategories = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/property_types').subscribe((data: PropertyType[]) => {
            this.enumsLoaded ++;
            this.propertyTypes = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/hero_stats').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.heroStats = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/gear_sets').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.gearSets = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/jewel_types').subscribe((data: JewelType[]) => {
            this.enumsLoaded ++;
            this.jewelTypes = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/passive_skill_triggers').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.passiveSkillTriggers = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/map_tile_types').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.mapTileTypes = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/map_tile_structures').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.mapTileStructures = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/map_tile_fight_icons').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.mapTileFightIcons = data;
        }, error => this.enumsFailed = true);
        this.http.get(API_URL + '/enum/map_backgrounds').subscribe((data: string[]) => {
            this.enumsLoaded ++;
            this.mapBackgrounds = data;
        }, error => this.enumsFailed = true);
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

    getMapBackgrounds(): string[] {
        return this.mapBackgrounds;
    }
}