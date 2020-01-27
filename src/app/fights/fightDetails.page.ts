import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService, ResourceType} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {ActivatedRoute} from '@angular/router';
import {Hero} from '../domain/hero.model';
import {FightResolved} from '../domain/fightResolved.model';
import {FightStageResolved} from '../domain/fightStageResolved.model';

@Component({
  selector: 'fight-details',
  templateUrl: 'fightDetails.page.html'
})
export class FightDetailsPage implements OnInit {

  saving = false;

  fight: FightResolved;
  serviceAccount: Player;
  heroes: Hero[];
  stage: FightStageResolved;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.backendService.getFight(id).subscribe(data => {
      this.fight = data;
      this.serviceAccount = data.serviceAccount;
      this.backendService.getServiceAccountHeroes(this.serviceAccount.id).subscribe(heroes => {
        this.heroes = heroes;
      });
    });
    if (!this.model.fightStageConfigs) {
      this.backendService.loadFightStageConfigs().subscribe(data => {
        this.model.fightStageConfigs = data;
      });
    }
    if (!this.model.fightEnvironments) {
      this.backendService.loadFightEnvironments().subscribe(data => {
        this.model.fightEnvironments = data;
      });
    }
  }

  selectStageConfig(event) {
    this.fight.stageConfig = event.detail.value;
  }

  selectEnvironment(event) {
    this.fight.environment = event.detail.value;
  }

  getResourceTypes(): ResourceType[] {
    return this.enumService.getResourceTypes().filter(r => r.category === 'BATTLE_FEE' && !r.name.startsWith('PREMIUM'));
  }

  addStage() {
    let stage = new FightStageResolved();
    stage.stage = this.fight.stages.length + 1;
    this.fight.stages.push(stage);
    this.stage = stage;
  }

  removeLastStage() {
    this.fight.stages.splice(this.fight.stages.length - 1, 1);
    if (this.stage.stage >= this.fight.stages.length) {
      this.stage = null;
    }
  }

  selectStage(toSelect: FightStageResolved) {
    this.stage = toSelect;
  }

  selectHero(hero: Hero) {
    if (!this.stage) {
      this.alertCtrl.create({
        subHeader: 'Please select a stage first'
      }).then(alert => alert.present());
    } else {
      if (!this.stage.hero1) {
        this.stage.hero1 = hero;
      } else if (!this.stage.hero2) {
        this.stage.hero2 = hero;
      } else if (!this.stage.hero3) {
        this.stage.hero3 = hero;
      } else if (!this.stage.hero4) {
        this.stage.hero4 = hero;
      } else {
        this.alertCtrl.create({
          subHeader: 'Stage ' + this.stage.stage + ' has no free hero slot'
        }).then(alert => alert.present());
      }
    }
  }

  saveFight() {
    this.saving = true;
    this.stage = null;
    this.backendService.saveFight(this.fight).subscribe(data => {
      this.fight = data;
      this.saving = false;
    });
  }
}
