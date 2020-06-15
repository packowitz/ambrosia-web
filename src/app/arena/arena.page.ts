import { Component, OnInit } from '@angular/core';
import {Model} from '../services/model.service';
import {ConverterService} from '../services/converter.service';
import {Hero} from '../domain/hero.model';
import {Team} from '../domain/team.model';
import {BackendService} from '../services/backend.service';
import {OtherTeam} from '../domain/otherTeam.model';
import {Router} from '@angular/router';
import {StoryService} from '../services/story.service';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.page.html'
})
export class ArenaPage implements OnInit {
  
  team: Team;
  hero1?: Hero;
  hero2?: Hero;
  hero3?: Hero;
  hero4?: Hero;

  otherTeams: OtherTeam[] = [];

  buildingType = 'ARENA';
  enterStory = this.buildingType + '_ENTERED';

  constructor(private model: Model,
              private converter: ConverterService,
              private backendService: BackendService,
              private storyService: StoryService,
              private router: Router) { }

  ngOnInit() {
    if (!this.model.teams) {
      this.backendService.getOwnTeams().subscribe(data => {
        this.model.teams = data;
        this.initTeam();
      });
    } else {
      this.initTeam();
    }
    this.loadOtherTeams();
  }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.showStory();
    }
  }

  showStory() {
    this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  initTeam() {
    this.team = this.model.teams.find(t => t.type === 'DUELL');
    if (!this.team) {
      this.team = new Team('DUELL');
    } else {
      this.hero1 = this.team.hero1Id ? this.model.heroes.find(h => h.id === this.team.hero1Id) : null;
      if (!this.hero1) { this.team.hero1Id = null; }
      this.hero2 = this.team.hero2Id ? this.model.heroes.find(h => h.id === this.team.hero2Id) : null;
      if (!this.hero2) { this.team.hero2Id = null; }
      this.hero3 = this.team.hero3Id ? this.model.heroes.find(h => h.id === this.team.hero3Id) : null;
      if (!this.hero3) { this.team.hero3Id = null; }
      this.hero4 = this.team.hero4Id ? this.model.heroes.find(h => h.id === this.team.hero4Id) : null;
      if (!this.hero4) { this.team.hero4Id = null; }
    }
  }

  getSelectedHeroes(): Hero[] {
    return [this.hero1, this.hero2, this.hero3, this.hero4];
  }

  loadOtherTeams() {
    this.otherTeams = [];
    this.backendService.getOtherTeams('DUELL').subscribe(data => {
      this.otherTeams = data;
    });
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

  isHeroSelected(hero: Hero): boolean {
    if (this.team.hero1Id && this.team.hero1Id === hero.id) {
      return true;
    }
    if (this.team.hero2Id && this.team.hero2Id === hero.id) {
      return true;
    }
    if (this.team.hero3Id && this.team.hero3Id === hero.id) {
      return true;
    }
    if (this.team.hero4Id && this.team.hero4Id === hero.id) {
      return true;
    }
    return false;
  }

  saveTeam() {
    this.backendService.saveTeam(this.team).subscribe(data => {
      let idx = this.model.teams.findIndex(t => t.id === data.id);
      if (idx >= 0) {
        this.model.teams[idx] = data;
      } else {
        this.model.teams.push(data);
      }
      this.initTeam();
    });
  }

  fight(otherTeam: OtherTeam) {
    this.backendService.startTestDuell(otherTeam, this.team).subscribe(data => {
      this.router.navigateByUrl('/battle');
    });
  }

}
