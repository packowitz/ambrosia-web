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
import {Team} from '../domain/team.model';

@Component({
  selector: 'enter-dungeon',
  templateUrl: 'enterDungeon.page.html'
})
export class EnterDungeonPage implements OnInit {

  saving = false;

  dungeon: DungeonResolved;
  team: Team;
  hero1?: Hero;
  hero2?: Hero;
  hero3?: Hero;
  hero4?: Hero;

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
    });
    if (!this.model.teams) {
      this.backendService.getOwnTeams().subscribe(data => {
        this.model.teams = data;
        this.initTeam();
      });
    } else {
      this.initTeam();
    }
  }

  initTeam() {
    this.team = this.model.teams.find(t => t.type === 'CAMPAIGN');
    if (!this.team) {
      this.team = new Team('CAMPAIGN');
    } else {
      this.hero1 = this.team.hero1Id ? this.model.heroes.find(h => h.id === this.team.hero1Id) : null;
      this.hero2 = this.team.hero2Id ? this.model.heroes.find(h => h.id === this.team.hero2Id) : null;
      this.hero3 = this.team.hero3Id ? this.model.heroes.find(h => h.id === this.team.hero3Id) : null;
      this.hero4 = this.team.hero4Id ? this.model.heroes.find(h => h.id === this.team.hero4Id) : null;
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

  start() {
    this.alertCtrl.create({
      subHeader: 'Coming soon. Stay tuned.'
    }).then(alert => alert.present());
  }
}
