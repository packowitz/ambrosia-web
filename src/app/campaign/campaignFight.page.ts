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

@Component({
  selector: 'campaign-fight',
  templateUrl: 'campaignFight.page.html'
})
export class CampaignFightPage {

  saving = false;

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

  enterStory = 'FIGHT_ENTERED';

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private router: Router,
              public model: Model,
              public enumService: EnumService,
              private popoverCtrl: PopoverController,
              private converter: ConverterService,
              private storyService: StoryService) {
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

    if (!this.model.teams) {
      this.backendService.getOwnTeams().subscribe(data => {
        this.model.teams = data;
        this.initTeam();
      });
    } else {
      this.initTeam();
    }

    if (this.storyService.storyUnknown(this.enterStory)) {
      this.showStory();
    }
  }

  initMapCampaign(mapId: number, posX: number, posY: number) {
    this.map = this.model.playerMaps.find(m => m.mapId === mapId);
    this.tile = this.map.tiles.find(t => t.posX === posX && t.posY === posY);
    this.backendService.getFight(this.tile.fightId).subscribe(data => {
      this.fight = data;
    });
  }

  initTestFight(fightId: number) {
    this.backendService.getFight(fightId).subscribe(data => {
      this.fight = data;
    });
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  showStory() {
    this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
  }

  initTeam() {
    if (this.model.teams) {
      let team = this.model.teams.find(t => t.type === (this.testFight ? 'TEST' : 'CAMPAIGN'));
      if (team) {
        this.team = this.converter.dataClone(team);
      }
    }
    if (!this.team) {
      this.team = new Team(this.testFight ? 'TEST' : 'CAMPAIGN');
    } else {
      this.hero1 = this.team.hero1Id ? this.model.heroes.find(h => h.id === this.team.hero1Id && !h.missionId) : null;
      if (!this.hero1) { this.team.hero1Id = null; }
      this.hero2 = this.team.hero2Id ? this.model.heroes.find(h => h.id === this.team.hero2Id && !h.missionId) : null;
      if (!this.hero2) { this.team.hero2Id = null; }
      this.hero3 = this.team.hero3Id ? this.model.heroes.find(h => h.id === this.team.hero3Id && !h.missionId) : null;
      if (!this.hero3) { this.team.hero3Id = null; }
      this.hero4 = this.team.hero4Id ? this.model.heroes.find(h => h.id === this.team.hero4Id && !h.missionId) : null;
      if (!this.hero4) { this.team.hero4Id = null; }
    }
    if (this.model.vehicles && this.model.vehicles.length > 0) {
      this.vehicle = this.model.vehicles.find(v => v.slot != null && !v.missionId);
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
        showVehiclesOnMission: false
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
    if (this.map) {
      this.backendService.startCampaignFight(this.map.mapId, this.tile.posX, this.tile.posY, this.team).subscribe(() => {
        this.router.navigateByUrl('/battle');
      });
    } else {
      this.backendService.startTestFight(this.fight.id, this.team).subscribe(() => {
        this.router.navigateByUrl('/battle');
      });
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
          this.backendService.startMission(this.map.mapId, this.tile.posX, this.tile.posY, this.team, dataReturned.data).subscribe(() => {
            this.router.navigateByUrl('/home');
          });
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
