import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService, ResourceType} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Hero} from '../domain/hero.model';
import {FightResolved} from '../domain/fightResolved.model';
import {FightStageResolved} from '../domain/fightStageResolved.model';
import {ConverterService} from '../services/converter.service';
import {LootBox} from '../domain/lootBox.model';

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
              private router: Router,
              public enumService: EnumService,
              private converter: ConverterService) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.backendService.getFight(id).subscribe(data => {
      this.fight = this.converter.dataClone(data);
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
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  cancel() {
    this.router.navigateByUrl('/fights');
  }

  compareById(o1, o2): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  getResourceTypes(): ResourceType[] {
    return this.enumService.getResourceTypes().filter(r => r.category === 'BATTLE_FEE');
  }

  getLootBoxes(): LootBox[] {
    return this.model.lootBoxes.filter(l => l.type === 'LOOT');
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
    this.backendService.saveFight(this.converter.asFight(this.fight)).subscribe(data => {
      this.fight = this.converter.dataClone(data);
      this.model.updateFight(data);
      this.saving = false;
    });
  }

  testFight() {
    this.router.navigateByUrl('/campaign/' + this.fight.id);
  }

  copy() {
    this.saving = true;
    let newFight: FightResolved = this.converter.dataClone(this.fight);
    newFight.id = null;
    newFight.name += ' (c)';
    newFight.stages.forEach(s => s.id = null);
    this.backendService.saveFight(this.converter.asFight(newFight)).subscribe(data => {
      this.model.updateFight(data);
      this.saving = false;
      this.router.navigateByUrl('/fights/' + data.id);
    }, () => {
      this.saving = false;
    });
  }
}
