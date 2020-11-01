import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Hero} from '../domain/hero.model';
import {FightResolved} from '../domain/fightResolved.model';
import {Team} from '../domain/team.model';
import {PlayerMap} from '../domain/playerMap.model';
import {PlayerMapTile} from '../domain/playerMapTile.model';
import {Vehicle} from '../domain/vehicle.model';
import {PopoverController} from '@ionic/angular';
import {VehicleSelectionPopover} from '../garage/vehicle-selection-popover';
import {StartMissionPopover} from './start-mission-popover';
import {ConverterService} from '../services/converter.service';
import {FightStageResolved} from '../domain/fightStageResolved.model';
import {StoryService} from '../services/story.service';
import {PropertyService} from '../services/property.service';

@Component({
  selector: 'campaign-fight',
  templateUrl: 'campaignFight.page.html'
})
export class CampaignFightPage {

  saving = false;

  blockView = false;

  map: PlayerMap;
  tile: PlayerMapTile;

  fight: FightResolved;
  team: Team;
  vehicle?: Vehicle;
  hero1?: Hero;
  hero2?: Hero;
  hero3?: Hero;
  hero4?: Hero;

  testFight = false;

  steamTimer = false;
  cogwheelsTimer = false;

  enterStory = 'FIGHT_ENTERED';
  fightTooHighStory = 'FIGHT_TOO_HIGH';

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private router: Router,
              public model: Model,
              public enumService: EnumService,
              private popoverCtrl: PopoverController,
              private converter: ConverterService,
              private storyService: StoryService,
              private propertyService: PropertyService) {
  }

  ionViewWillEnter() {
    let fightId = Number(this.route.snapshot.paramMap.get('fightId'));
    if (fightId) {
      this.testFight = true;
      this.initTestFight(fightId);
    } else {
      let mapId = Number(this.route.snapshot.paramMap.get('mapId'));
      let posX = Number(this.route.snapshot.paramMap.get('posX'));
      let posY = Number(this.route.snapshot.paramMap.get('posY'));
      this.initMapCampaign(mapId, posX, posY);
    }

    this.initTeam();

    if (this.storyService.storyUnknown(this.enterStory)) {
      this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
    }
  }

  initMapCampaign(mapId: number, posX: number, posY: number) {
    this.map = this.model.playerMaps.find(m => m.mapId === mapId);
    this.tile = this.map.tiles.find(t => t.posX === posX && t.posY === posY);
    this.backendService.getFight(this.tile.fightId).subscribe(data => {
      this.fight = data;
      this.checkFightTooHighStory();
    });
  }

  initTestFight(fightId: number) {
    this.backendService.getFight(fightId).subscribe(data => {
      this.fight = data;
    });
  }

  checkFightTooHighStory() {
    if (this.storyService.storyUnknown(this.fightTooHighStory)) {
      let highestHeroLevel = 0;
      this.model.heroes.forEach(h => { if (h.level > highestHeroLevel) { highestHeroLevel = h.level; } });
      if ((highestHeroLevel + 3) < this.fight.level) {
        this.storyService.showStory(this.fightTooHighStory).subscribe(() => console.log(this.fightTooHighStory + ' story finished'));
      }
    }
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  getXp(fight: FightResolved): number {
    let xp = fight.xp;
    let bonus = 100 + this.model.progress.battleXpBoost;
    if (this.vehicle && this.vehicle.frame) {
      this.propertyService.getVehiclePartProperties(this.vehicle.frame)
          .filter(p => p.vehicleStat === 'BATTLE_XP')
          .forEach(p => bonus += p.value1);
    }
    return Math.round(xp * bonus / 100);
  }

  initTeam() {
    if (this.model.teams) {
      let team = this.model.teams.find(t => t.type === (this.testFight ? 'TEST' : `C_${this.map.mapId}`));
      if (team) {
        this.team = this.converter.dataClone(team);
      }
    }
    if (!this.team) {
      this.team = new Team(this.testFight ? 'TEST' : `C_${this.map.mapId}`);
    } else {
      this.hero1 = this.team.hero1Id ? this.model.heroes.find(h => h.id === this.team.hero1Id && !h.missionId && !h.playerExpeditionId) : null;
      if (!this.hero1) { this.team.hero1Id = null; }
      this.hero2 = this.team.hero2Id ? this.model.heroes.find(h => h.id === this.team.hero2Id && !h.missionId && !h.playerExpeditionId) : null;
      if (!this.hero2) { this.team.hero2Id = null; }
      this.hero3 = this.team.hero3Id ? this.model.heroes.find(h => h.id === this.team.hero3Id && !h.missionId && !h.playerExpeditionId) : null;
      if (!this.hero3) { this.team.hero3Id = null; }
      this.hero4 = this.team.hero4Id ? this.model.heroes.find(h => h.id === this.team.hero4Id && !h.missionId && !h.playerExpeditionId) : null;
      if (!this.hero4) { this.team.hero4Id = null; }
      if (this.team.vehicleId) {
        let vehicle = this.model.getVehicle(this.team.vehicleId);
        if (vehicle && !vehicle.missionId && !vehicle.upgradeTriggered && !vehicle.playerExpeditionId) {
          this.vehicle = vehicle;
        }
      }

    }
    if (!this.vehicle && this.model.vehicles && this.model.vehicles.length > 0) {
      this.vehicle = this.model.vehicles.find(v => v.slot != null && !v.missionId && !v.upgradeTriggered && !v.playerExpeditionId);
    }
  }

  selectHero(hero: Hero) {
    if (!this.successfullyRemoved(hero)) {
      if (!this.team.hero1Id) {
        this.team.hero1Id = hero.id;
        this.hero1 = hero;
      } else if (!this.team.hero2Id) {
        this.team.hero2Id = hero.id;
        this.hero2 = hero;
      } else if (!this.team.hero3Id) {
        this.team.hero3Id = hero.id;
        this.hero3 = hero;
      } else if (!this.team.hero4Id) {
        this.team.hero4Id = hero.id;
        this.hero4 = hero;
      }
    }
  }

  selectVehicle() {
    this.popoverCtrl.create({
      component: VehicleSelectionPopover,
      componentProps: {
        noVehicle: true,
        vehiclesInSlot: true,
        showBusyVehicles: false
      }
    }).then(modal => {
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
          this.vehicle = dataReturned.data;
        } else {
          this.vehicle = null;
        }
      });
      modal.present();
    });
  }

  successfullyRemoved(hero: Hero): boolean {
    if (this.team.hero1Id && this.team.hero1Id === hero.id) {
      this.team.hero1Id = null;
      this.hero1 = null;
      return true;
    }
    if (this.team.hero2Id && this.team.hero2Id === hero.id) {
      this.team.hero2Id = null;
      this.hero2 = null;
      return true;
    }
    if (this.team.hero3Id && this.team.hero3Id === hero.id) {
      this.team.hero3Id = null;
      this.hero3 = null;
      return true;
    }
    if (this.team.hero4Id && this.team.hero4Id === hero.id) {
      this.team.hero4Id = null;
      this.hero4 = null;
      return true;
    }
    return false;
  }

  canStartBattle(): boolean {
    if (this.fight.resourceType === 'STEAM' && (this.model.resources.premiumSteam + this.model.resources.steam) < this.fight.costs) {
      return false;
    }
    if (this.fight.resourceType === 'COGWHEELS' && (this.model.resources.premiumCogwheels + this.model.resources.cogwheels) < this.fight.costs) {
      return false;
    }
    if (this.fight.resourceType === 'TOKENS' && (this.model.resources.premiumTokens + this.model.resources.tokens) < this.fight.costs) {
      return false;
    }
    return !!this.hero1 || !!this.hero2 || !!this.hero3 || !!this.hero4;
  }

  start() {
    this.model.updateTeam(this.team);
    if (this.vehicle) {
      this.team.vehicleId = this.vehicle.id;
    } else {
      this.team.vehicleId = null;
    }
    this.saving = true;
    if (this.map) {
      this.backendService.startCampaignFight(this.map.mapId, this.tile.posX, this.tile.posY, this.team).subscribe(() => {
        this.saving = false;
        this.router.navigateByUrl('/battle');
      }, () => this.saving = false );
    } else {
      this.backendService.startTestFight(this.fight.id, this.team).subscribe(() => {
        this.saving = false;
        this.router.navigateByUrl('/battle');
      }, () => this.saving = false );
    }
  }

  offlineBattleEnabled(): boolean {
    return this.tile.victoriousFight&& this.tile.fightRepeatable;
  }

  openMission() {
    this.popoverCtrl.create({
      component: StartMissionPopover,
      componentProps: {
        fight: this.fight
      }
    }).then(modal => {
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
          this.model.updateTeam(this.team);
          this.team.vehicleId = this.vehicle.id;
          this.saving = true;
          this.backendService.startMission(this.map.mapId, this.tile.posX, this.tile.posY, this.team, dataReturned.data).subscribe(() => {
            this.saving = false;
            this.router.navigateByUrl('/home');
          }, () => this.saving = false );
        }
      });
      modal.present();
    });
  }

  getSelectedHeroes(): Hero[] {
    return [this.hero1, this.hero2, this.hero3, this.hero4];
  }

  getStageHeroe(stage: FightStageResolved): Hero[] {
    return [stage.hero1, stage.hero2, stage.hero3, stage.hero4];
  }
}
