import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HeroBase} from '../domain/herobase.model';
import {Hero} from '../domain/hero.model';
import {Player} from '../domain/player.model';
import {Gear} from '../domain/gear.model';
import {Jewelry} from '../domain/jewelry.model';
import {map} from 'rxjs/operators';
import {Team} from '../domain/team.model';
import {OtherTeam} from '../domain/otherTeam.model';
import {Battle} from '../domain/battle.model';
import {BattleHero} from '../domain/battleHero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {API_URL} from '../../environments/environment';
import {JewelType} from './enum.service';
import {Model} from './model.service';
import {Fight} from '../domain/fight.model';
import {FightResolved} from '../domain/fightResolved.model';
import {Map} from '../domain/map.model';
import {PlayerMap} from '../domain/playerMap.model';
import {FightStageConfig} from '../domain/fightStageConfig.model';
import {FightEnvironment} from '../domain/fightEnvironment.model';
import {Building} from '../domain/building.model';
import {Resources} from '../domain/resources.model';
import {LootBox} from '../domain/lootBox.model';
import {GearLoot} from '../domain/gearLoot.model';

export class Looted {
    type: string;
    resourceType: string;
    value: number;
}
export class PlayerActionResponse {
    player?: Player;
    token?: string;
    resources: Resources;
    hero?: Hero;
    heroes?: Hero[];
    heroIdsRemoved?: number[];
    gear?: Gear;
    gears?: Gear[];
    gearIdsRemovedFromArmory?: number[];
    jewelries?: Jewelry[];
    buildings?: Building[];
    playerMaps?: PlayerMap[];
    currentMap?: PlayerMap;
    ongoingBattle?: Battle;
    looted?: Looted[];
}

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    constructor(private http: HttpClient, private model: Model) {}

    getPlayer(): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/player', null);
    }

    selectPlayerColor(color: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/player/color', {color: color});
    }

    login(email: string, password: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/auth/login', {email: email, password: password});
    }

    register(name: string, email: string, password: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/auth/register', {name: name, email: email, password: password});
    }

    getHeroBases(): Observable<HeroBase[]> {
        return this.http.get<HeroBase[]>(API_URL + '/admin/hero_base');
    }

    getHeroBase(id): Observable<HeroBase> {
        return this.http.get<HeroBase>(API_URL + '/admin/hero_base/' + id);
    }

    createHeroBase(data): Observable<HeroBase> {
        return this.http.post<HeroBase>(API_URL + '/admin/hero_base', data);
    }

    saveHeroBase(hero: HeroBase): Observable<HeroBase> {
        return this.http.put<HeroBase>(API_URL + '/admin/hero_base/' + hero.id, hero);
    }

    recruitHero(hero: HeroBase): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/recruit/' + hero.id, null)
            .pipe(map(action => action.hero));
    }

    recruitRandomHero(type: String): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/hero/recruit/' + type, null)
            .pipe(map(action => action.hero));
    }

    getAllOwnHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(API_URL + '/hero');
    }

    getGear(amount: number, set: string): Observable<Gear> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/gear/open/' + set + '/' + amount, null)
            .pipe(map(action => action.gear));
    }

    getAllOwnGear(): Observable<Gear[]> {
        return this.http.get<Gear[]>(API_URL + '/gear');
    }

    getJewel(amount: number, type: JewelType): Observable<Jewelry> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/jewelry/open/' + type.name + '/' + amount, null)
            .pipe(map(action => action.jewelries[0]));
    }

    getOwnJewelries(): Observable<Jewelry[]> {
        return this.http.get<Jewelry[]>(API_URL + '/jewelry');
    }

    craftGear(gear: Gear): Observable<Gear> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/gear/create', gear)
            .pipe(map(action => action.gear));
    }

    equipGear(hero: Hero, gear: Gear): Observable<Hero> {
        let request = {
            heroId: hero.id,
            gearId: gear.id
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/gear/equip', request)
            .pipe(map(action => action.hero));
    }

    unequipGear(hero: Hero, gear: Gear): Observable<Hero> {
        let request = {
            heroId: hero.id,
            gearId: gear.id
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/gear/unequip', request)
            .pipe(map(action => action.hero));
    }

    adminHeroGainLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/gain_level', null)
            .pipe(map(action => action.hero));
    }

    adminHeroLooseLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/loose_level', null)
            .pipe(map(action => action.hero));
    }

    adminHeroGainAscLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/gain_asc_level', null)
            .pipe(map(action => action.hero));
    }

    adminHeroLooseAscLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/loose_asc_level', null)
            .pipe(map(action => action.hero));
    }

    heroGainSkillLevel(hero: Hero, skillNumber: number): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/hero/' + hero.id + '/skill_up/' + skillNumber, null)
            .pipe(map(action => action.hero));
    }

    heroResetSkills(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/hero/' + hero.id + '/reset_skills', null)
            .pipe(map(action => action.hero));
    }

    upgradeJewel(type: string, level: number): Observable<Jewelry> {
        return this.http.post<PlayerActionResponse>(API_URL + '/jewelry/merge/' + type + '/' + level, {})
            .pipe(map(action => action.jewelries[0]));
    }

    pluginJewel(gear: Gear, slot: number, type: string, level: number): Observable<PlayerActionResponse> {
        let request = {gearId: gear.id, slot: slot, jewelType: type, lvl: level};
        return this.http.post<PlayerActionResponse>(API_URL + '/gear/plugin/jewel', request);
    }

    unplugJewel(gear: Gear, slot: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/gear/unplug/jewel', {gearId: gear.id, slot: slot});
    }

    getOwnTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(API_URL + '/teams');
    }

    saveTeam(team: Team): Observable<Team> {
        if (team.id) {
            return this.http.put<Team>(API_URL + '/teams/' + team.id, team);
        } else {
            return this.http.post<Team>(API_URL + '/teams/type/' + team.type, team);
        }
    }

    getOtherTeams(type: string): Observable<OtherTeam[]> {
        return this.http.get<OtherTeam[]>(API_URL + '/teams/type/' + type);
    }

    getBattle(battleId): Observable<PlayerActionResponse> {
        return this.http.get<PlayerActionResponse>(API_URL + '/battle/' + battleId);
    }

    startTestDuell(otherTeam: OtherTeam, ownTeam: Team): Observable<PlayerActionResponse> {
        let request = {
            type: 'TEST',
            oppPlayerId: otherTeam.playerId,
            hero1Id: ownTeam.hero1Id,
            hero2Id: ownTeam.hero2Id,
            hero3Id: ownTeam.hero3Id,
            hero4Id: ownTeam.hero4Id,
            oppHero1Id: otherTeam.hero1 ? otherTeam.hero1.id : null,
            oppHero2Id: otherTeam.hero2 ? otherTeam.hero2.id : null,
            oppHero3Id: otherTeam.hero3 ? otherTeam.hero3.id : null,
            oppHero4Id: otherTeam.hero4 ? otherTeam.hero4.id : null
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/battle', request);
    }

    takeTurn(battle: Battle, hero: BattleHero, skill: HeroSkill, target: BattleHero): Observable<PlayerActionResponse> {
        let url = API_URL + '/battle/' + battle.id + '/' + hero.position + '/' + skill.number + '/' + target.position;
        return this.http.post<PlayerActionResponse>(url, null);
    }

    takeAutoTurn(battle: Battle, hero: BattleHero): Observable<PlayerActionResponse> {
        let url = API_URL + '/battle/' + battle.id + '/' + hero.position + '/auto';
        return this.http.post<PlayerActionResponse>(url, null);
    }

    surrender(battle: Battle): Observable<PlayerActionResponse> {
        let url = API_URL + '/battle/' + battle.id + '/surrender';
        return this.http.post<PlayerActionResponse>(url, null);
    }

    createServiceAccount(name: string) {
        this.http.post<Player>(API_URL + '/admin/service_account/new/' + name, {})
            .subscribe(data => this.model.serviceAccounts.push(data));
    }

    getAllServiceAccounts(): Observable<Player[]> {
        return this.http.get<Player[]>(API_URL + '/admin/service_account');
    }

    useServiceAccount(id: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/service_account/use/' + id, {});
    }

    getServiceAccountHeroes(id: number): Observable<Hero[]> {
        return this.http.get<Hero[]>(API_URL + '/admin/service_account/' + id + '/heroes');
    }

    loadFights(): Observable<Fight[]> {
        return this.http.get<Fight[]>(API_URL + '/fight');
    }

    createFight(name: string, serviceAccount: Player): Observable<Fight> {
        let request = {
            name: name,
            serviceAccountId: serviceAccount.id
        };
        return this.http.post<Fight>(API_URL + '/admin/fight/new', request);
    }

    getFight(id): Observable<FightResolved> {
        return this.http.get<FightResolved>(API_URL + '/fight/' + id);
    }

    saveFight(fight: FightResolved): Observable<FightResolved> {
        let request: Fight = {
            id: fight.id,
            name: fight.name,
            serviceAccountId: fight.serviceAccount.id,
            resourceType: fight.resourceType,
            costs: fight.costs,
            xp: fight.xp,
            level: fight.level,
            ascPoints: fight.ascPoints,
            stageConfig: fight.stageConfig,
            environment: fight.environment,
            lootBox: fight.lootBox,
            stages: fight.stages.map(s => {
                return {
                    id: s.id,
                    stage: s.stage,
                    hero1Id: s.hero1 ? s.hero1.id : null,
                    hero2Id: s.hero2 ? s.hero2.id : null,
                    hero3Id: s.hero3 ? s.hero3.id : null,
                    hero4Id: s.hero4 ? s.hero4.id : null,
                };
            })
        };
        return this.http.put<FightResolved>(API_URL + '/admin/fight/' + fight.id, request);
    }

    loadFightStageConfigs(): Observable<FightStageConfig[]> {
        return this.http.get<FightStageConfig[]>(API_URL + '/admin/fight_stage_config');
    }

    createFightStageConfig(name: string): Observable<FightStageConfig> {
        let request = {
            name: name
        };
        return this.http.post<FightStageConfig>(API_URL + '/admin/fight_stage_config/new', request);
    }

    updateFightStageConfig(config: FightStageConfig): Observable<FightStageConfig> {
        return this.http.put<FightStageConfig>(API_URL + '/admin/fight_stage_config/' + config.id, config);
    }

    loadFightEnvironments(): Observable<FightEnvironment[]> {
        return this.http.get<FightEnvironment[]>(API_URL + '/admin/fight_environment');
    }

    createFightEnvironment(name: string): Observable<FightEnvironment> {
        let request = {
            name: name
        };
        return this.http.post<FightEnvironment>(API_URL + '/admin/fight_environment/new', request);
    }

    updateFightEnvironment(env: FightEnvironment): Observable<FightEnvironment> {
        return this.http.put<FightEnvironment>(API_URL + '/admin/fight_environment/' + env.id, env);
    }

    startCampaignFight(mapId: number, posX: number, posY: number, team: Team): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/battle/campaign/' + mapId + '/' + posX + '/' + posY, team);
    }

    startTestFight(fightId: number, team: Team): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/battle/campaign/test/' + fightId, team);
    }

    repeatTestFight(battleId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/battle/repeat/test/' + battleId, null);
    }

    loadAllMaps(): Observable<Map[]> {
        return this.http.get<Map[]>(API_URL + '/admin/map');
    }

    createMap(name: string, width: number, height: number): Observable<Map> {
        let request = {
            name: name,
            width: width,
            height: height
        };
        return this.http.post<Map>(API_URL + '/admin/map/new', request);
    }

    saveMap(aMap: Map): Observable<Map> {
        return this.http.put<Map>(API_URL + '/admin/map/' + aMap.id, aMap);
    }

    discoverMap(mapId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/map/' + mapId + '/discover', null);
    }

    setCurrentMap(mapId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/map/' + mapId + '/current', null);
    }

    getPlayerMap(mapId: number): Observable<PlayerMap> {
        return this.http.get<PlayerMap>(API_URL + '/map/' + mapId);
    }

    resetMap(mapId: number, discovered: boolean, fights: boolean, chests: boolean): Observable<PlayerActionResponse> {
        let request = {
            discovered: discovered,
            fights: fights,
            chests: chests
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/map/' + mapId + '/reset', request);
    }

    discoverMapTile(mapId: number, posX: number, posY: number): Observable<PlayerActionResponse> {
        let request = {
            mapId: mapId,
            posX: posX,
            posY: posY
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/map/discover', request);
    }

    discoverBuilding(mapId: number, posX: number, posY: number): Observable<PlayerActionResponse> {
        let request = {
            mapId: mapId,
            posX: posX,
            posY: posY
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/map/new_building', request);
    }

    openChest(mapId: number, posX: number, posY: number): Observable<PlayerActionResponse> {
        let request = {
            mapId: mapId,
            posX: posX,
            posY: posY
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/map/open_chest', request);
    }

    loadAllLootBoxes(): Observable<LootBox[]> {
        return this.http.get<LootBox[]>(API_URL + '/admin/loot/box');
    }

    saveLootBox(lootBox: LootBox): Observable<LootBox> {
        return this.http.post<LootBox>(API_URL + '/admin/loot/box', lootBox);
    }

    loadAllGearLoots(): Observable<GearLoot[]> {
        return this.http.get<GearLoot[]>(API_URL + '/admin/loot/gear');
    }

    newGearLoot(name: string): Observable<GearLoot> {
        return this.http.post<GearLoot>(API_URL + '/admin/loot/gear', {name: name});
    }

    saveGearLoot(gearLoot: GearLoot): Observable<GearLoot> {
        return this.http.post<GearLoot>(API_URL + '/admin/loot/gear', gearLoot);
    }
}