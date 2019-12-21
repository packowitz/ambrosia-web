import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {Dungeon} from '../domain/dungeon.model';
import {ActivatedRoute} from '@angular/router';
import {Hero} from '../domain/hero.model';
import {DungeonStage} from '../domain/dungeonStage.model';
import {DungeonResolved} from '../domain/dungeonResolved.model';
import {DungeonStageResolved} from '../domain/dungeonStageResolved.model';

@Component({
  selector: 'dungeon-details',
  templateUrl: 'dungeonDetails.page.html'
})
export class DungeonDetailsPage implements OnInit {

  saving = false;

  dungeon: DungeonResolved;
  serviceAccount: Player;
  heroes: Hero[];
  stage: DungeonStageResolved;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.backendService.getDungeon(id).subscribe(data => {
      this.dungeon = data;
      this.serviceAccount = data.serviceAccount;
      this.backendService.getServiceAccountHeroes(this.serviceAccount.id).subscribe(heroes => {
        this.heroes = heroes;
      });
    });
  }

  addStage() {
    let stage = new DungeonStageResolved();
    stage.stage = this.dungeon.stages.length + 1;
    this.dungeon.stages.push(stage);
    this.stage = stage;
  }

  removeLastStage() {
    this.dungeon.stages.splice(this.dungeon.stages.length - 1, 1);
    if (this.stage.stage >= this.dungeon.stages.length) {
      this.stage = null;
    }
  }

  selectStage(toSelect: DungeonStageResolved) {
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

  saveDungeon() {
    this.saving = true;
    this.stage = null;
    this.backendService.saveDungeon(this.dungeon).subscribe(data => {
      this.dungeon = data;
      this.saving = false;
    });
  }
}
