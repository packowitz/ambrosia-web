import { Component, OnInit } from '@angular/core';
import {Model} from '../services/model.service';
import {Battle} from '../domain/battle.model';
import {BattleHero} from '../domain/battleHero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {BackendService} from '../services/backend.service';
import {BattleStep} from '../domain/battleStep.model';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.page.html',
  styleUrls: ['./battle.page.scss'],
})
export class BattlePage implements OnInit {

  battle: Battle;
  activeHero: BattleHero;
  selectedSkill: HeroSkill;

  steps: BattleStep[] = [];
  lastKnownTurn = 0;

  constructor(private model: Model, private backendService: BackendService) {}

  ngOnInit() {
    this.setActiveHero(this.model.ongoingBattle);
  }

  setActiveHero(battle: Battle) {
    if (battle) {
      this.battle = battle;
      this.steps = battle.steps.sort((a, b) => b.turn - a.turn);
      if (this.battle.status === 'WON' || this.battle.status === 'LOST') {
        this.activeHero = null;
      } else if (this.battle.hero1 && this.battle.hero1.position === this.battle.activeHero) {
        this.activeHero = this.battle.hero1;
      } else if (this.battle.hero2 && this.battle.hero2.position === this.battle.activeHero) {
        this.activeHero = this.battle.hero2;
      } else if (this.battle.hero3 && this.battle.hero3.position === this.battle.activeHero) {
        this.activeHero = this.battle.hero3;
      } else if (this.battle.hero4 && this.battle.hero4.position === this.battle.activeHero) {
        this.activeHero = this.battle.hero4;
      }
    }

    if (this.activeHero) {
      this.selectedSkill = this.activeHero.heroBase.skills[0];
    } else {
      this.selectedSkill = null;
    }
  }

  getSkills(): HeroSkill[] {
    return this.activeHero.heroBase.skills.filter(s => s.number === 1 || this.activeHero['skill' + s.number + 'Cooldown'] >= 0);
  }

  selectable(hero: BattleHero): boolean {
    if (this.activeHero) {
      if (hero && this.selectedSkill) {
        if (this.isOpponent(hero)) {
          return this.selectedSkill.target === 'OPPONENT' || this.selectedSkill.target === 'OPP_IGNORE_TAUNT';
        } else {
          if (hero.position === this.activeHero.position) {
            return this.selectedSkill.target === 'SELF' || this.selectedSkill.target === 'ALL_OWN';
          } else {
            return this.selectedSkill.target === 'ALL_OWN';
          }
        }
      }
    }
    return false;
  }

  isOpponent(hero: BattleHero): boolean {
    if (this.activeHero) {
      if (this.activeHero.position.startsWith('HERO')) {
        return hero.position.startsWith('OPP');
      } else {
        return hero.position.startsWith('HERO');
      }
    }
  }

  selectTarget(hero: BattleHero) {
    this.lastKnownTurn = this.steps.length > 0 ? this.steps[0].turn : 0;
    this.backendService.takeTurn(this.battle, this.activeHero, this.selectedSkill, hero).subscribe(data => {
      this.setActiveHero(data);
    });
  }

}
