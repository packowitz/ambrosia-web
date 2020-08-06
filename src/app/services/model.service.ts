import {Injectable} from '@angular/core';
import {Player} from '../domain/player.model';
import {Hero} from '../domain/hero.model';
import {Gear} from '../domain/gear.model';
import {HeroBase} from '../domain/herobase.model';
import {Looted, PlayerActionResponse} from './backend.service';
import {Team} from '../domain/team.model';
import {Battle} from '../domain/battle.model';
import {API_URL, environment} from '../../environments/environment';
import {Fight} from '../domain/fight.model';
import {Map} from '../domain/map.model';
import {PlayerMap} from '../domain/playerMap.model';
import {FightStageConfig} from '../domain/fightStageConfig.model';
import {FightEnvironment} from '../domain/fightEnvironment.model';
import {Building} from '../domain/building.model';
import {Resources} from '../domain/resources.model';
import {HttpClient} from '@angular/common/http';
import {LootBox} from '../domain/lootBox.model';
import {GearLoot} from '../domain/gearLoot.model';
import {VehicleBase} from '../domain/vehicleBase.model';
import {Progress} from '../domain/progress.model';
import {Vehicle} from '../domain/vehicle.model';
import {VehiclePart} from '../domain/vehiclePart.model';
import {Mission} from '../domain/mission.model';
import {Upgrade} from '../domain/upgrade.model';
import {Incubator} from '../domain/incubator.model';
import {FightResolved} from '../domain/fightResolved.model';
import {ConverterService} from './converter.service';
import {ExpeditionBase} from '../domain/expeditionBase.model';
import {Expedition} from '../domain/expedition.model';
import {PlayerExpedition} from '../domain/playerExpedition.model';
import {OddJobBase} from '../domain/oddJobBase.model';
import {OddJob} from '../domain/oddJob.model';
import {DailyActivity} from '../domain/dailyActivity.model';
import {Achievements} from '../domain/achievements.model';
import {MerchantItem} from '../domain/merchantItem.model';
import {MerchantPlayerItem} from '../domain/merchantPlayerItem.model';
import {AchievementReward} from '../domain/achievementReward.model';
import {BlackMarketItem} from '../domain/blackMarketItem.model';

@Injectable({
    providedIn: 'root'
})
export class Model {

    playerName: string;
    playerId: number;
    activeAccountId: number;
    player: Player;
    progress: Progress;
    achievements: Achievements;
    resources: Resources;
    baseHeroes: HeroBase[];
    heroes: Hero[];
    gears: Gear[];
    teams: Team[];
    ongoingBattle?: Battle;
    serviceAccounts: Player[] = [];
    fights: Fight[];
    fightStageConfigs: FightStageConfig[];
    fightEnvironments: FightEnvironment[];
    buildings: Building[];
    vehicles: Vehicle[];
    vehicleParts: VehiclePart[];
    lootBoxes: LootBox[];
    gearLoots: GearLoot[];
    maps: Map[];
    playerMaps: PlayerMap[];
    currentMap: PlayerMap;
    baseVehicles: VehicleBase[];
    missions: Mission[];
    upgrades: Upgrade[];
    incubators: Incubator[];
    knownStories: string[];
    expeditions: Expedition[];
    playerExpeditions: PlayerExpedition[];
    oddJobs: OddJob[];
    looted: Looted;
    expeditionBases: ExpeditionBase[];
    oddJobBases: OddJobBase[];
    merchantItems: MerchantItem[];
    dailyActivity: DailyActivity;
    merchantPlayerItems: MerchantPlayerItem[];
    allAchievementRewards: AchievementReward[];
    achievementRewards: AchievementReward[];
    blackMarketItems: BlackMarketItem[];
    allBlackMarketItems: BlackMarketItem[];

    interval: number;
    lastIntervalTimestamp: number = Date.now();
    expeditionsCheckedTimestamp: number = Date.now();
    updateResourcesInProgress = false;
    updateResourcesFailed = false;
    updateIncubatorsInProgress = false;
    updateIncubatorsFailed = false;
    updatePlayerExpeditionsInProgress = false;
    updatePlayerExpeditionsFailed = false;
    updateExpeditionsInProgress = false;
    updateCurrentMapInProgress = false;
    updateCurrentMapFailed = false;
    updateMerchantPlayerItemsInProgress = false;
    updateMerchantPlayerItemsFailed = false;
    useServiceAccount = false;

    constructor(private http: HttpClient,
                private converter: ConverterService) {}

    reset() {
        this.progress = null;
        this.heroes = null;
        this.gears = null;
        this.teams = null;
        this.ongoingBattle = null;
        this.buildings = null;
        this.vehicles = null;
        this.vehicleParts = null;
        this.playerMaps = null;
        this.currentMap = null;
        this.missions = null;
        this.upgrades = null;
        this.incubators = null;
        this.looted = null;
        this.knownStories = null;
        this.expeditions = null;
        this.playerExpeditions = null;
        this.oddJobs = null;
        this.dailyActivity = null;
    }

    getHeroBase(id: number): HeroBase {
        return this.baseHeroes.find(h => h.id === id);
    }

    getHero(id: number): Hero {
        return this.heroes.find(h => h.id === id);
    }

    getGear(id: number): Gear {
        return this.gears.find(g => g.id === id);
    }

    getVehicleBase(id: number): VehicleBase {
        return this.baseVehicles.find(v => v.id === id);
    }

    getVehicle(id: number): Vehicle {
        return this.vehicles.find(v => v.id === id);
    }

    getVehiclePart(id: number): VehiclePart {
        return this.vehicleParts.find(p => p.id === id);
    }

    getBuilding(type: string): Building {
        return this.buildings.find(b => b.type === type);
    }

    hasEnoughResources(type: string, amount: number): boolean {
        return this.getResourceAmount(type) >= amount;
    }

    getResourceAmount(type: string): number {
        if (type === 'STEAM') { return (this.resources.steam + this.resources.premiumSteam); }
        if (type === 'COGWHEELS') { return (this.resources.cogwheels + this.resources.premiumCogwheels); }
        if (type === 'TOKENS') { return (this.resources.tokens + this.resources.premiumTokens); }
        if (type === 'COINS') { return this.resources.coins; }
        if (type === 'RUBIES') { return this.resources.rubies; }
        if (type === 'METAL') { return this.resources.metal; }
        if (type === 'IRON') { return this.resources.iron; }
        if (type === 'STEEL') { return this.resources.steel; }
        if (type === 'WOOD') { return this.resources.wood; }
        if (type === 'BROWN_COAL') { return this.resources.brownCoal; }
        if (type === 'BLACK_COAL') { return this.resources.blackCoal; }
        if (type === 'SIMPLE_GENOME') { return this.resources.simpleGenome; }
        if (type === 'COMMON_GENOME') { return this.resources.commonGenome; }
        if (type === 'UNCOMMON_GENOME') { return this.resources.uncommonGenome; }
        if (type === 'RARE_GENOME') { return this.resources.rareGenome; }
        if (type === 'EPIC_GENOME') { return this.resources.epicGenome; }
        if (type === 'WOODEN_KEYS') { return this.resources.woodenKeys; }
        if (type === 'BRONZE_KEYS') { return this.resources.bronzeKeys; }
        if (type === 'SILVER_KEYS') { return this.resources.silverKeys; }
        if (type === 'GOLDEN_KEYS') { return this.resources.goldenKeys; }
        return 0;
    }

    getAchievementAmount(type: string): number {
        if (type === 'STEAM_USED') { return this.achievements.steamUsed; }
        if (type === 'COGWHEELS_USED') { return this.achievements.cogwheelsUsed; }
        if (type === 'TOKENS_USED') { return this.achievements.tokensUsed; }
        if (type === 'COINS_USED') { return this.achievements.coinsUsed; }
        if (type === 'RUBIES_USED') { return this.achievements.rubiesUsed; }
        if (type === 'METAL_USED') { return this.achievements.metalUsed; }
        if (type === 'IRON_USED') { return this.achievements.ironUsed; }
        if (type === 'STEEL_USED') { return this.achievements.steelUsed; }
        if (type === 'WOOD_USED') { return this.achievements.woodUsed; }
        if (type === 'BROWN_COAL_USED') { return this.achievements.brownCoalUsed; }
        if (type === 'BLACK_COAL_USED') { return this.achievements.blackCoalUsed; }
        if (type === 'SIMPLE_INCUBATIONS') { return this.achievements.simpleIncubationsDone; }
        if (type === 'COMMON_INCUBATIONS') { return this.achievements.commonIncubationsDone; }
        if (type === 'UNCOMMON_INCUBATIONS') { return this.achievements.uncommonIncubationsDone; }
        if (type === 'RARE_INCUBATIONS') { return this.achievements.rareIncubationsDone; }
        if (type === 'EPIC_INCUBATIONS') { return this.achievements.epicIncubationsDone; }
        if (type === 'EXPEDITIONS') { return this.achievements.expeditionsDone; }
        if (type === 'ODD_JOBS') { return this.achievements.oddJobsDone; }
        if (type === 'DAILY_ACTIVITY') { return this.achievements.dailyRewardsClaimed; }
        if (type === 'ACADEMY_XP') { return this.achievements.academyXpGained; }
        if (type === 'ACADEMY_ASC') { return this.achievements.academyAscGained; }
        if (type === 'MERCHANT_ITEMS_BOUGHT') { return this.achievements.merchantItemsBought; }
        if (type === 'MAP_TILES_DISCOVERED') { return this.achievements.mapTilesDiscovered; }
        if (type === 'GEAR_MODIFICATIONS') { return this.achievements.gearModified; }
        if (type === 'JEWELS_MERGED') { return this.achievements.jewelsMerged; }
        if (type === 'BUILDING_UPGRADES') { return this.achievements.buildingsUpgradesDone; }
        if (type === 'VEHICLE_UPGRADES') { return this.achievements.vehiclesUpgradesDone; }
        if (type === 'VEHICLE_PART_UPGRADES') { return this.achievements.vehiclePartUpgradesDone; }
        if (type === 'BUILDING_MIN_LEVEL') { return this.achievements.buildingMinLevel; }
        if (type === 'WOODEN_KEYS_COLLECTED') { return this.achievements.woodenKeysCollected; }
        if (type === 'BRONZE_KEYS_COLLECTED') { return this.achievements.bronzeKeysCollected; }
        if (type === 'SILVER_KEYS_COLLECTED') { return this.achievements.silverKeysCollected; }
        if (type === 'GOLDEN_KEYS_COLLECTED') { return this.achievements.goldenKeysCollected; }
        if (type === 'CHESTS_OPENED') { return this.achievements.chestsOpened; }
        return 0;
    }

    startInterval() {
        this.interval = setInterval(() => {
            let now = Date.now();
            let pauseDetected = (now - this.lastIntervalTimestamp) > 5000;
            if (pauseDetected) {
                console.log("Pause detected. Updating all time based resources");
            }

            if (this.progress && this.progress.expeditionLevel > 0 && (now - this.expeditionsCheckedTimestamp) > 300000) {
                this.loadExpeditions();
            }

            this.lastIntervalTimestamp = now;
            if (this.resources) {
                let updateResources = pauseDetected || this.updateResourcesFailed;
                if (this.resources.steam < this.resources.steamMax) {
                    this.resources.steamProduceIn --;
                    updateResources = updateResources || this.resources.steamProduceIn <= 0;
                }
                if (this.resources.cogwheels < this.resources.cogwheelsMax) {
                    this.resources.cogwheelsProduceIn --;
                    updateResources = updateResources || this.resources.cogwheelsProduceIn <= 0;
                }
                if (this.resources.tokens < this.resources.tokensMax) {
                    this.resources.tokensProduceIn --;
                    updateResources = updateResources || this.resources.tokensProduceIn <= 0;
                }
                if (updateResources) {
                    this.loadResources();
                }
            }

            if (this.missions) {
                this.missions.filter(m => !m.missionFinished).forEach(mission => {
                    mission.secondsUntilDone --;
                    mission.nextUpdateSeconds --;
                    mission.battles.forEach(battle => {
                        battle.secondsUntilDone --;
                    });
                    if (!mission.updating && (pauseDetected || mission.updateFailed || mission.nextUpdateSeconds <= 0)) {
                        mission.updating = true;
                        this.http.get<Mission>(API_URL + '/battle/mission/' + mission.id).subscribe(data => {
                            this.updateMission(data);
                            console.log("Updated mission " + data.id);
                        }, () => {
                            mission.updating = false;
                            mission.updateFailed = true;
                        });
                    }
                });
            }

            if (this.upgrades) {
                let upgradeInProgress = this.upgrades.find(u => u.inProgress);
                if (upgradeInProgress) {
                    upgradeInProgress.secondsUntilDone --;
                    if (!upgradeInProgress.updating && (pauseDetected || upgradeInProgress.updateFailed || upgradeInProgress.secondsUntilDone <= 0)) {
                        upgradeInProgress.updating = true;
                        this.http.get<Upgrade[]>(API_URL + '/upgrade/check').subscribe(data => {
                            upgradeInProgress.updating = false;
                            upgradeInProgress.updateFailed = false;
                            data.forEach(u => this.updateUpgrade(u));
                            console.log("Updated upgrades");
                        }, () => {
                            upgradeInProgress.updating = false;
                            upgradeInProgress.updateFailed = true;
                        });
                    }
                }
            }

            if (this.incubators) {
                let incubatorUpdate = pauseDetected || this.updateIncubatorsFailed;
                this.incubators.filter(i => !i.finished).forEach(incubator => {
                    incubator.secondsUntilDone --;
                    if (incubator.secondsUntilDone <= 0) {
                        incubatorUpdate = true;
                    }
                });
                if (incubatorUpdate) {
                    this.loadIncubators();
                }
            }

            if (this.playerExpeditions && this.playerExpeditions.length > 0) {
                this.playerExpeditions.filter(p => !p.completed).forEach(p => p.secondsUntilDone --);
                if (pauseDetected || this.updatePlayerExpeditionsFailed) {
                    this.loadPlayerExpeditions();
                }
            }

            if (this.playerMaps) {
                this.playerMaps.forEach(p => {
                    if (p.secondsToReset) {
                        if (p.secondsToReset > 0 ) { p.secondsToReset --; }
                        if (pauseDetected || this.updateCurrentMapFailed || p.secondsToReset <= 0) {
                            this.loadMap(p.mapId);
                        }
                    }
                });
            }

            if (this.merchantPlayerItems && this.merchantPlayerItems.length > 0) {
                let firstMerchantPlayerItem = this.merchantPlayerItems[0];
                if (firstMerchantPlayerItem.secondsUntilRefresh > 0) { firstMerchantPlayerItem.secondsUntilRefresh --; }
                if (pauseDetected || this.updateMerchantPlayerItemsFailed || firstMerchantPlayerItem.secondsUntilRefresh <= 0) {
                    this.loadMerchantPlayerItems();
                }
            }

        }, 1000);
    }

    loadResources() {
        if (!this.updateResourcesInProgress) {
            this.updateResourcesInProgress = true;
            this.http.get<Resources>(API_URL + '/resources').subscribe(data => {
                this.resources = data;
                this.updateResourcesFailed = false;
                this.updateResourcesInProgress = false;
            }, () => {
                this.updateResourcesFailed = true;
                this.updateResourcesInProgress = false;
                console.log('load resources failed');
            });
        }
    }

    loadIncubators() {
        if (!this.updateIncubatorsInProgress) {
            this.updateIncubatorsInProgress = true;
            this.http.get<Incubator[]>(API_URL + '/laboratory/incubators').subscribe(data => {
                this.incubators = data;
                this.updateIncubatorsFailed = false;
                this.updateIncubatorsInProgress = false;
            }, () => {
                this.updateIncubatorsFailed = true;
                this.updateIncubatorsInProgress = false;
                console.log('load incubators failed');
            });
        }
    }

    loadPlayerExpeditions() {
        if (!this.updatePlayerExpeditionsInProgress) {
            this.updatePlayerExpeditionsInProgress = true;
            this.http.get<PlayerExpedition[]>(API_URL + '/expedition/in-progress').subscribe(data => {
                this.playerExpeditions = data;
                this.updatePlayerExpeditionsInProgress = false;
            }, () => {
                this.updatePlayerExpeditionsInProgress = false;
                console.log('load player expeditions failed');
            });
        }
    }


    loadExpeditions() {
        if (!this.updateExpeditionsInProgress) {
            this.updateExpeditionsInProgress = true;
            console.log('Updating active expeditions');
            this.http.get<Expedition[]>(API_URL + '/expedition/active').subscribe(data => {
                this.expeditions = data;
                this.expeditionsCheckedTimestamp = Date.now();
                this.updateExpeditionsInProgress = false;
            }, () => {
                this.updateExpeditionsInProgress = false;
                console.log('load expeditions failed');
            });
        }
    }

    loadMap(mapId: number) {
        if (!this.updateCurrentMapInProgress) {
            this.updateCurrentMapInProgress = true;
            this.http.get<PlayerMap>(API_URL + '/map/' + mapId).subscribe(data => {
                this.updatePlayerMap(data);
                this.updateCurrentMapFailed = false;
                this.updateCurrentMapInProgress = false;
            }, () => {
                this.updateCurrentMapFailed = true;
                this.updateCurrentMapInProgress = false;
                console.log('load current map failed');
            } );
        }
    }

    loadMerchantPlayerItems() {
        if (!this.updateMerchantPlayerItemsInProgress) {
            this.updateMerchantPlayerItemsInProgress = true;
            this.http.get<MerchantPlayerItem[]>(API_URL + '/bazaar/merchant/items').subscribe(data => {
                this.merchantPlayerItems = data;
                this.updateMerchantPlayerItemsFailed = false;
                this.updateMerchantPlayerItemsInProgress = false;
            }, () => {
                this.updateMerchantPlayerItemsFailed = true;
                this.updateMerchantPlayerItemsInProgress = false;
                console.log('load merchant player items failed');
            } );
        }
    }

    update(data: PlayerActionResponse) {
        if (data.player) {
            this.player = data.player;
        }
        if (data.token) {
            let key = environment.tokenKey;
            if (this.player.serviceAccount) {
                key = environment.serviceTokenKey;
            }
            localStorage.setItem(key, data.token);
        }
        if (data.progress) {
            if (this.progress && this.progress.expeditionLevel !== data.progress.expeditionLevel) {
                this.loadExpeditions();
            }
            this.progress = data.progress;
        }
        if (data.achievements) {
            this.achievements = data.achievements;
        }
        if (data.upgrades) {
            if (this.upgrades) {
                data.upgrades.forEach(u => this.updateUpgrade(u));
            } else {
                this.upgrades = data.upgrades;
            }
        }
        if (data.upgradeRemoved) {
            let idx = this.upgrades.findIndex(u => u.id === data.upgradeRemoved);
            if (idx >= 0) {
                this.upgrades.splice(idx, 1);
            }
        }
        if (data.resources) {
            this.resources = data.resources;
            if (!this.interval) {
                this.startInterval();
            }
        }
        if (data.hero) {
            this.updateHero(data.hero);
        }
        if (data.heroes) {
            if (this.heroes) {
                data.heroes.forEach(h => this.updateHero(h));
            } else {
                this.heroes = data.heroes;
            }
        }
        if (data.heroIdsRemoved && this.heroes) {
            this.heroes = this.heroes.filter(h => data.heroIdsRemoved.findIndex(i => i === h.id) === -1);
        }
        if (data.gear) {
            this.updateGear(data.gear);
        }
        if (data.gears) {
            if (this.gears) {
                data.gears.forEach(g => this.updateGear(g));
            } else {
                this.gears = data.gears;
            }
        }
        if (data.gearIdsRemovedFromArmory && this.gears) {
            this.gears = this.gears.filter(g => data.gearIdsRemovedFromArmory.findIndex(i => i === g.id) === -1);
        }
        if (data.buildings) {
            if (this.buildings) {
                data.buildings.forEach(b => this.updateBuilding(b));
            } else {
                this.buildings = data.buildings;
            }
        }
        if (data.vehicles) {
            if (this.vehicles) {
                data.vehicles.forEach(v => this.updateVehicle(v));
            } else {
                this.vehicles = data.vehicles;
            }
        }
        if (data.vehicleParts) {
            if (this.vehicleParts) {
                data.vehicleParts.forEach(p => this.updateVehiclePart(p));
            } else {
                this.vehicleParts = data.vehicleParts;
            }
        }
        if (data.playerMaps) {
            if (this.playerMaps) {
                data.playerMaps.forEach(m => this.updatePlayerMap(m));
            } else {
                this.playerMaps = data.playerMaps;
            }
        }
        if (data.currentMap) {
            this.updatePlayerMap(data.currentMap);
        }
        if (data.ongoingBattle) {
            if (data.ongoingBattle.status === 'WON' || data.ongoingBattle.status === 'LOST') {
                this.ongoingBattle = null;
            } else {
                this.ongoingBattle = data.ongoingBattle;
            }
        }
        if (data.missions) {
            if (this.missions) {
                data.missions.forEach(m => this.updateMission(m));
            } else {
                this.missions = data.missions;
            }
        }
        if (data.missionIdFinished && this.missions) {
            let idx = this.missions.findIndex(m => m.id === data.missionIdFinished);
            if (idx >= 0) {
                this.missions.splice(idx, 1);
            }
        }
        if (data.incubators) {
            if (this.incubators) {
                data.incubators.forEach(i => this.updateIncubator(i));
            } else {
                this.incubators = data.incubators;
            }
        }
        if (data.incubatorDone && this.incubators) {
            let idx = this.incubators.findIndex(i => i.id === data.incubatorDone);
            if (idx >= 0) {
                this.incubators.splice(idx, 1);
            }
        }
        if (data.knownStories) {
            if (this.knownStories) {
                data.knownStories.forEach(s => this.finishedStory(s));
            } else {
                this.knownStories = data.knownStories;
            }
        }
        if (data.expeditions) {
            this.expeditions = data.expeditions;
        }
        if (data.playerExpeditions) {
            if (this.playerExpeditions) {
                data.playerExpeditions.forEach(p => this.updatePlayerExpedition(p));
            } else {
                this.playerExpeditions = data.playerExpeditions;
            }
        }
        if (data.playerExpeditionCancelled) {
            let idx = this.playerExpeditions.findIndex(p => p.id === data.playerExpeditionCancelled);
            if (idx >= 0) {
                this.playerExpeditions.splice(idx, 1);
            }
        }
        if (data.oddJobs) {
            if (this.oddJobs) {
                data.oddJobs.forEach(o => this.updateOddJob(o));
            } else {
                this.oddJobs = data.oddJobs;
            }
        }
        if (data.oddJobDone) {
            let idx = this.oddJobs.findIndex(o => o.id === data.oddJobDone);
            if (idx >= 0) {
                this.oddJobs.splice(idx, 1);
            }
        }
        if (data.dailyActivity) {
            this.dailyActivity = data.dailyActivity;
        }
        if (data.merchantItems && data.merchantItems.length > 0) {
            this.merchantPlayerItems = data.merchantItems;
        }
        if (data.boughtMerchantItem) {
            let item = this.merchantPlayerItems.find(m => m.id === data.boughtMerchantItem.id);
            if (item) {
                item.sold = true;
            }
        }
        if (data.blackMarketItems && data.blackMarketItems.length > 0) {
            this.blackMarketItems = data.blackMarketItems;
        }
        if (data.looted) {
            this.looted = data.looted;
        }
        if (data.achievementRewards) {
            if (this.achievementRewards) {
                data.achievementRewards.forEach(a => this.updateAchievementReward(a));
            } else {
                this.achievementRewards = data.achievementRewards.sort((a, b) => a.name > b.name ? 1 : -1 );
            }
        }
        if (data.claimedAchievementRewardId) {
            let idx = this.achievementRewards.findIndex(a => a.id === data.claimedAchievementRewardId);
            if (idx >= 0) {
                this.achievementRewards.splice(idx, 1);
            }
        }
    }

    updateBaseHero(hero?: HeroBase) {
        if (hero) {
            let idx = this.baseHeroes.findIndex(h => h.id === hero.id);
            if (idx >= 0) {
                this.baseHeroes[idx] = hero;
            } else {
                this.baseHeroes.push(hero);
            }
        }
    }

    updateHero(hero?: Hero) {
        if (hero) {
            let idx = this.heroes.findIndex(h => h.id === hero.id);
            if (idx >= 0) {
                this.heroes[idx] = hero;
            } else {
                this.heroes.push(hero);
            }
            this.heroes = this.heroes.sort((a, b) => {
                if (a.level === b.level) {
                    if (a.stars === b.stars) {
                        if (a.heroBaseId === b.heroBaseId) {
                            return a.id - b.id;
                        } else {
                            return a.heroBaseId - b.heroBaseId;
                        }
                    } else {
                        return b.stars - a.stars;
                    }
                } else {
                    return b.level - a.level;
                }
            });
        }
    }

    updateGear(gear?: Gear) {
        if (gear && !gear.equippedTo) {
            let idx = this.gears.findIndex(g => g.id === gear.id);
            if (idx >= 0) {
                this.gears[idx] = gear;
            } else {
                this.gears.push(gear);
            }
        }
    }

    updateBuilding(building?: Building) {
        if (building) {
            let idx = this.buildings.findIndex(g => g.id === building.id);
            if (idx >= 0) {
                this.buildings[idx] = building;
            } else {
                this.buildings.push(building);
            }
        }
    }

    updateMap(map?: Map) {
        if (map) {
            let idx = this.maps.findIndex(g => g.id === map.id);
            if (idx >= 0) {
                this.maps[idx] = map;
            } else {
                this.maps.push(map);
            }
        }
    }

    updatePlayerMap(map?: PlayerMap) {
        if (map) {
            let idx = this.playerMaps.findIndex(g => g.mapId === map.mapId);
            if (idx >= 0) {
                this.playerMaps[idx] = map;
            } else {
                this.playerMaps.unshift(map);
            }
            if (map.mapId === this.progress.currentMapId) {
                this.currentMap = map;
            }
        }
    }

    updateFight(fight?: FightResolved) {
        if (fight && this.fights) {
            let idx = this.fights.findIndex(f => f.id === fight.id);
            if (idx >= 0) {
                this.fights[idx] = this.converter.asFight(fight);
            } else {
                this.fights.push(this.converter.asFight(fight));
            }
        }
    }

    updateFightStageConfig(config?: FightStageConfig) {
        if (config) {
            let idx = this.fightStageConfigs.findIndex(c => c.id === config.id);
            if (idx >= 0) {
                this.fightStageConfigs[idx] = config;
            } else {
                this.fightStageConfigs.push(config);
            }
        }
    }

    updateFightEnvironment(env?: FightEnvironment) {
        if (env) {
            let idx = this.fightEnvironments.findIndex(e => e.id === env.id);
            if (idx >= 0) {
                this.fightEnvironments[idx] = env;
            } else {
                this.fightEnvironments.push(env);
            }
        }
    }

    updateLootBox(lootBox?: LootBox) {
        if (lootBox) {
            let idx = this.lootBoxes.findIndex(l => l.id === lootBox.id);
            if (idx >= 0) {
                this.lootBoxes[idx] = lootBox;
            } else {
                this.lootBoxes.push(lootBox);
            }
        }
    }

    updateGearLoot(gearLoot?: GearLoot) {
        if (gearLoot) {
            let idx = this.gearLoots.findIndex(l => l.id === gearLoot.id);
            if (idx >= 0) {
                this.gearLoots[idx] = gearLoot;
            } else {
                this.gearLoots.push(gearLoot);
            }
        }
    }

    updateTeam(team?: Team) {
        if (team) {
            let idx = this.teams.findIndex(t => t.type === team.type);
            if (idx >= 0) {
                this.teams[idx] = team;
            } else {
                this.teams.push(team);
            }
        }
    }

    updateVehicleBase(vehicle?: VehicleBase) {
        if (vehicle) {
            let idx = this.baseVehicles.findIndex(t => t.id === vehicle.id);
            if (idx >= 0) {
                this.baseVehicles[idx] = vehicle;
            } else {
                this.baseVehicles.push(vehicle);
            }
        }
    }

    updateVehicle(vehicle?: Vehicle) {
        if (vehicle) {
            let idx = this.vehicles.findIndex(v => v.id === vehicle.id);
            if (idx >= 0) {
                this.vehicles[idx] = vehicle;
            } else {
                this.vehicles.push(vehicle);
            }
        }
    }

    updateVehiclePart(part?: VehiclePart) {
        if (part) {
            let idx = this.vehicleParts.findIndex(p => p.id === part.id);
            if (idx >= 0) {
                this.vehicleParts[idx] = part;
            } else {
                this.vehicleParts.push(part);
            }
        }
    }

    updateMission(mission?: Mission) {
        if (mission && mission.id && mission.id > 0) {
            let idx = this.missions.findIndex(m => m.id === mission.id);
            if (idx >= 0) {
                this.missions[idx] = mission;
            } else {
                this.missions.push(mission);
                this.missions = this.missions.sort((a, b) => a.slotNumber - b.slotNumber);
            }
        }
    }

    updateUpgrade(upgrade?: Upgrade) {
        if (upgrade) {
            let idx = this.upgrades.findIndex(u => u.id === upgrade.id);
            if (idx >= 0) {
                this.upgrades[idx] = upgrade;
            } else {
                this.upgrades.push(upgrade);
            }
            this.upgrades = this.upgrades.sort((a, b) => a.position - b.position);
        }
    }

    updateIncubator(incubator?: Incubator) {
        if (incubator) {
            let idx = this.incubators.findIndex(i => i.id === incubator.id);
            if (idx >= 0) {
                this.incubators[idx] = incubator;
            } else {
                this.incubators.push(incubator);
            }
        }
    }

    updatePlayerExpedition(playerExpedition?: PlayerExpedition) {
        if (playerExpedition) {
            let idx = this.playerExpeditions.findIndex(p => p.id === playerExpedition.id);
            if (idx >= 0) {
                this.playerExpeditions[idx] = playerExpedition;
            } else {
                this.playerExpeditions.push(playerExpedition);
            }
        }
    }

    updateOddJob(oddJob?: OddJob) {
        if (oddJob) {
            let idx = this.oddJobs.findIndex(o => o.id === oddJob.id);
            if (idx >= 0) {
                this.oddJobs[idx] = oddJob;
            } else {
                this.oddJobs.push(oddJob);
            }
        }
    }

    updateAchievementReward(reward?: AchievementReward) {
        if (reward) {
            let idx = this.achievementRewards.findIndex(a => a.id === a.id);
            if (idx >= 0) {
                this.achievementRewards[idx] = reward;
            } else {
                this.achievementRewards.push(reward);
                this.achievementRewards = this.achievementRewards.sort((a, b) => a.name > b.name ? 1 : -1 );
            }
        }
    }

    finishedStory(story: string) {
        if (story) {
            if (this.knownStories.indexOf(story) === -1) {
                this.knownStories.push(story);
            }
        }
    }

}
