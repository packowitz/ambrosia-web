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
import {VehicleBase} from '../domain/vehicleBase.model';
import {Vehicle} from '../domain/vehicle.model';
import {VehiclePart} from '../domain/vehiclePart.model';
import {Progress} from '../domain/progress.model';
import {Mission} from '../domain/mission.model';
import {Upgrade} from '../domain/upgrade.model';
import {Incubator} from '../domain/incubator.model';
import {StoryPlaceholder} from '../domain/storyPlaceholder.model';
import {Story} from '../domain/story.model';
import {ExpeditionBase} from '../domain/expeditionBase.model';
import {Expedition} from '../domain/expedition.model';
import {PlayerExpedition} from '../domain/playerExpedition.model';
import {OddJobBase} from '../domain/oddJobBase.model';
import {OddJob} from '../domain/oddJob.model';
import {DailyActivity} from '../domain/dailyActivity.model';
import {Achievements} from '../domain/achievements.model';
import {MerchantItem} from '../domain/merchantItem.model';
import {MerchantPlayerItem} from '../domain/merchantPlayerItem.model';
import {BlackMarketItem} from '../domain/blackMarketItem.model';
import {AutoBreakdownConfiguration} from '../domain/autoBreakdownConfiguration.model';
import {InboxMessage} from "../domain/inboxMessage.model";
import {TaskCluster} from "../domain/taskCluster.model";
import {PlayerTask} from "../domain/playerTask.model";

export class Looted {
    type: string;
    items: LootedItem[];

    // transient
    autobreakdownChecked: boolean;
}
export class LootedItem {
    type: string;
    resourceType: string;
    progressStat: string;
    jewelType: JewelType;
    value: number;
}
export class PlayerActionResponse {
    player?: Player;
    progress?: Progress;
    achievements?: Achievements;
    token?: string;
    resources?: Resources;
    hero?: Hero;
    heroes?: Hero[];
    heroIdsRemoved?: number[];
    gear?: Gear;
    gears?: Gear[];
    gearIdsRemovedFromArmory?: number[];
    jewelries?: Jewelry[];
    buildings?: Building[];
    vehicles?: Vehicle[];
    vehicleParts?: VehiclePart[];
    playerMaps?: PlayerMap[];
    currentMap?: PlayerMap;
    ongoingBattle?: Battle;
    looted?: Looted;
    missions?: Mission[];
    missionIdFinished?: number;
    upgrades?: Upgrade[];
    upgradeRemoved?: number;
    incubators?: Incubator[];
    incubatorDone?: number;
    knownStories?: string[];
    expeditions?: Expedition[];
    playerExpeditions?: PlayerExpedition[];
    playerExpeditionCancelled?: number;
    oddJobs?: OddJob[];
    oddJobDone?: number;
    dailyActivity?: DailyActivity;
    merchantItems?: MerchantPlayerItem[];
    boughtMerchantItem?: MerchantPlayerItem;
    blackMarketItems?: BlackMarketItem[];
    autoBreakdownConfiguration?: AutoBreakdownConfiguration;
    inboxMessages?: InboxMessage[];
    inboxMessageDeleted?: number;
    teams: Team[];
    playerTasks: PlayerTask[];
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
        return this.http.get<HeroBase[]>(API_URL + '/hero_base');
    }

    getHeroBase(id): Observable<HeroBase> {
        return this.http.get<HeroBase>(API_URL + '/hero_base/' + id);
    }

    createHeroBase(data): Observable<HeroBase> {
        return this.http.post<HeroBase>(API_URL + '/admin/hero_base', data);
    }

    deleteHeroBase(heroId): Observable<any> {
        return this.http.delete<any>(API_URL + '/admin/hero_base/' + heroId);
    }

    saveHeroBase(hero: HeroBase): Observable<HeroBase> {
        return this.http.put<HeroBase>(API_URL + '/admin/hero_base/' + hero.id, hero);
    }

    recruitHero(hero: HeroBase): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/recruit/' + hero.id, null)
            .pipe(map(action => action.hero));
    }

    getAllOwnHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(API_URL + '/hero');
    }

    getGear(amount: number, rarity: string, set: string): Observable<Gear> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/gear/open/' + set + '/' + rarity + '/' + amount, null)
            .pipe(map(action => action.gear));
    }

    getAllOwnGear(): Observable<Gear[]> {
        return this.http.get<Gear[]>(API_URL + '/gear');
    }

    getJewel(amount: number, level: number, type: JewelType): Observable<Jewelry> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/jewelry/open/' + type.name + '/' + level + '/' + amount, null)
            .pipe(map(action => action.jewelries[0]));
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

    betaTesterHeroGainLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/tester/hero/' + hero.id + '/gain_level', null)
            .pipe(map(action => action.hero));
    }

    betaTesterHeroLooseLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/tester/hero/' + hero.id + '/loose_level', null)
            .pipe(map(action => action.hero));
    }

    betaTesterHeroGainAscLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/tester/hero/' + hero.id + '/gain_asc_level', null)
            .pipe(map(action => action.hero));
    }

    betaTesterHeroLooseAscLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/tester/hero/' + hero.id + '/loose_asc_level', null)
            .pipe(map(action => action.hero));
    }

    markHeroAsBoss(hero: Hero, isBoss: boolean): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/boss/' + isBoss, null)
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

    upgradeJewel(type: string, level: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/upgrade/jewel/' + type + '/' + level, null);
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

    saveFight(fight: Fight): Observable<FightResolved> {
        return this.http.put<FightResolved>(API_URL + '/admin/fight', fight);
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

    startMission(mapId: number, posX: number, posY: number, team: Team, battleTimes: number): Observable<PlayerActionResponse> {
        let request = {
            type: team.type,
            battleTimes: battleTimes,
            mapId: mapId,
            posX: posX,
            posY: posY,
            vehicleId: team.vehicleId,
            hero1Id: team.hero1Id,
            hero2Id: team.hero2Id,
            hero3Id: team.hero3Id,
            hero4Id: team.hero4Id
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/battle/mission', request);
    }

    finishMission(missionId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/battle/mission/' + missionId + '/finish', null);
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

    setMapFavorite(mapId: number, favorite: boolean): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/map/' + mapId + '/favorite/' + favorite, null);
    }

    resetMap(mapId: number, discovered: boolean, fights: boolean, chests: boolean): Observable<PlayerActionResponse> {
        let request = {
            discovered: discovered,
            fights: fights,
            chests: chests
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/tester/map/' + mapId + '/reset', request);
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

    feedHeroesForXp(hero: Hero, fodder1?: Hero, fodder2?: Hero, fodder3?: Hero, fodder4?: Hero, fodder5?: Hero, fodder6?: Hero): Observable<PlayerActionResponse> {
        let request = {
            hero1Id: fodder1 ? fodder1.id : null,
            hero2Id: fodder2 ? fodder2.id : null,
            hero3Id: fodder3 ? fodder3.id : null,
            hero4Id: fodder4 ? fodder4.id : null,
            hero5Id: fodder5 ? fodder5.id : null,
            hero6Id: fodder6 ? fodder6.id : null
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/academy/hero/' + hero.id + '/level', request);
    }

    feedHeroesForEvolve(hero: Hero, fodder1?: Hero, fodder2?: Hero, fodder3?: Hero, fodder4?: Hero, fodder5?: Hero, fodder6?: Hero): Observable<PlayerActionResponse> {
        let request = {
            hero1Id: fodder1 ? fodder1.id : null,
            hero2Id: fodder2 ? fodder2.id : null,
            hero3Id: fodder3 ? fodder3.id : null,
            hero4Id: fodder4 ? fodder4.id : null,
            hero5Id: fodder5 ? fodder5.id : null,
            hero6Id: fodder6 ? fodder6.id : null
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/academy/hero/' + hero.id + '/evolve', request);
    }

    loadAllBaseVehicles(): Observable<VehicleBase[]> {
        return this.http.get<VehicleBase[]>(API_URL + '/vehicle');
    }

    newBaseVehicle(name: string): Observable<VehicleBase> {
        return this.http.post<VehicleBase>(API_URL + '/admin/vehicle', {name: name});
    }

    saveBaseVehicle(vehicle: VehicleBase): Observable<VehicleBase> {
        return this.http.post<VehicleBase>(API_URL + '/admin/vehicle', vehicle);
    }

    deactivateVehicle(vehicle: Vehicle): Observable<Vehicle> {
        return this.http.post<Vehicle>(API_URL + '/vehicle/' + vehicle.id + '/deactivate', null);
    }

    activateVehicle(vehicle: Vehicle, slot: number): Observable<Vehicle> {
        return this.http.post<Vehicle>(API_URL + '/vehicle/' + vehicle.id + '/activate/' + slot, null);
    }

    pluginPart(part: VehiclePart, vehicle: Vehicle): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/vehicle/' + vehicle.id + '/plugin/' + part.id, null);
    }

    unplugPart(part: VehiclePart, vehicle: Vehicle): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/vehicle/' + vehicle.id + '/unplug/' + part.id, null);
    }

    upgradeBuilding(buildingType: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/upgrade/building/' + buildingType, null);
    }

    upgradeVehicle(vehicleId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/upgrade/vehicle/' + vehicleId, null);
    }

    upgradeVehiclePart(partId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/upgrade/vehicle_part/' + partId, null);
    }

    upgradeGear(gearId: number, modification: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/upgrade/gear/' + gearId + '/' + modification, null);
    }

    finishUpgrade(upgradeId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/upgrade/' + upgradeId + '/finish', null);
    }

    cancelUpgrade(upgradeId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/upgrade/' + upgradeId + '/cancel', null);
    }

    moveUpgradeUp(upgradeId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/upgrade/' + upgradeId + '/moveup', null);
    }

    betaTesterGainResources(resourceType: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/tester/resources/gain/' + resourceType, null);
    }

    cloneHero(genomeType: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/laboratory/clone/' + genomeType, null);
    }

    openIncubator(incubatorId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/laboratory/open/' + incubatorId, null);
    }

    cancelIncubator(incubatorId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/laboratory/cancel/' + incubatorId, null);
    }

    breakdownGear(gears: Gear[], silent?: boolean): Observable<PlayerActionResponse> {
        let request = {
            gearIds: gears.map(g => g.id),
            silent: silent === true
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/forge/breakdown', request);
    }

    getStoryPlaceholder(): Observable<StoryPlaceholder[]> {
        return this.http.get<StoryPlaceholder[]>(API_URL + '/admin/story/placeholder');
    }

    saveStoryPlaceholder(placeholder: StoryPlaceholder): Observable<StoryPlaceholder> {
        return this.http.post<StoryPlaceholder>(API_URL + '/admin/story/placeholder', placeholder);
    }

    loadPlayerStory(storyTrigger: string): Observable<Story[]> {
        return this.http.get<Story[]>(API_URL + '/story/' + storyTrigger);
    }

    loadStory(storyTrigger: string): Observable<Story[]> {
        return this.http.get<Story[]>(API_URL + '/admin/story/' + storyTrigger);
    }

    saveStoryLine(stories: Story[], lootBoxId: number, toDelete: number[]): Observable<Story[]> {
        let request = {
            stories: stories,
            lootBoxId: lootBoxId,
            toDelete: toDelete
        };
        return this.http.post<Story[]>(API_URL + '/admin/story', request);
    }

    finishStory(story: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/story/' + story + '/finish', null);
    }

    resetStoryLine(): Observable<any> {
        return this.http.post<any>(API_URL + '/admin/story/reset', null);
    }

    loadExpeditionBases(): Observable<ExpeditionBase[]> {
        return this.http.get<ExpeditionBase[]>(API_URL + '/admin/expedition');
    }

    saveExpeditionBases(expedition: ExpeditionBase): Observable<ExpeditionBase> {
        return this.http.post<ExpeditionBase>(API_URL + '/admin/expedition', expedition);
    }

    playerLevelUp(): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/progress/level_up', null);
    }

    startExpedition(expedition: Expedition, team: Team): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/expedition/' + expedition.id + '/start', team);
    }

    finishExpedition(expeditionId: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/expedition/' + expeditionId + '/finish', null);
    }

    loadOddJobBases(): Observable<OddJobBase[]> {
        return this.http.get<OddJobBase[]>(API_URL + '/admin/oddjob');
    }

    saveOddJobBase(oddJobBase: OddJobBase): Observable<OddJobBase> {
        return this.http.post<OddJobBase>(API_URL + '/admin/oddjob', oddJobBase);
    }

    removeOddJob(oddJob: OddJob): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/oddjob/' + oddJob.id + '/remove', null);
    }

    claimOddJob(oddJob: OddJob): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/oddjob/' + oddJob.id + '/claim', null);
    }

    claimDaily(day: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/oddjob/daily/' + day, null);
    }

    acceptTrade(tradeName: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/bazaar/trade/' + tradeName, null);
    }

    getMerchantItems(): Observable<MerchantItem[]> {
        return this.http.get<MerchantItem[]>(API_URL + '/admin/merchant/item');
    }

    saveMerchantItem(item: MerchantItem): Observable<MerchantItem> {
        return this.http.post<MerchantItem>(API_URL + '/admin/merchant/item', item);
    }

    renewMerchantItems(): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/bazaar/merchant/items/renew', null);
    }

    buyMerchantItem(item: MerchantPlayerItem): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/bazaar/merchant/buy/' + item.id, null);
    }

    getKnownHeroIds(): Observable<number[]> {
        return this.http.get<number[]>(API_URL + '/hero/known');
    }

    getAllBlackMarketItems(): Observable<BlackMarketItem[]> {
        return this.http.get<BlackMarketItem[]>(API_URL + '/admin/blackmarket/item');
    }

    saveBlackMarketItem(item: BlackMarketItem): Observable<BlackMarketItem> {
        return this.http.post<BlackMarketItem>(API_URL + '/admin/blackmarket/item', item);
    }

    buyBlackMarketItem(item: BlackMarketItem): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/bazaar/blackmarket/buy/' + item.id, null);
    }

    saveAutoBreakdownConfig(config: AutoBreakdownConfiguration): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/forge/auto', config);
    }

    claimMessage(msg: InboxMessage): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/inbox/claim/' + msg.id, null);
    }

    loadTaskClusters(): Observable<TaskCluster[]> {
        return this.http.get<TaskCluster[]>(API_URL + '/tasks');
    }

    saveTaskCluster(taskCluster: TaskCluster): Observable<TaskCluster> {
        return this.http.post<TaskCluster>(API_URL + '/admin/tasks', taskCluster);
    }

    claimPlayerTask(cluster: TaskCluster): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/tasks/claim/' + cluster.id, null);
    }
}
