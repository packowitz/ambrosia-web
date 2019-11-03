import { Component, OnInit } from '@angular/core';
import {Model} from '../services/model.service';
import {Battle} from '../domain/battle.model';
import {BattleHero} from '../domain/battleHero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {BackendService} from '../services/backend.service';
import {BattleStep} from '../domain/battleStep.model';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.page.html',
  styleUrls: ['./battle.page.scss'],
})
export class BattlePage implements OnInit {

  battle: Battle;
  activeHero: BattleHero;
  selectedSkill: HeroSkill;

  animateStep: BattleStep = null;
  lastKnownStepIdx = -1;
  animationStepIdx = -1;

  autobattle = false;
  loading = false;

  constructor(private model: Model,
              private backendService: BackendService,
              private alertCtrl: AlertController) {}

  ngOnInit() {
    setTimeout(() => this.initBattle(this.model.ongoingBattle), 1000);
  }

  initBattle(battle: Battle) {
    if (battle) {
      this.battle = battle;
      this.setActiveHero();
    }
  }

  setActiveHero() {
    // animation
    if (this.animationStepIdx < this.battle.steps.length - 1) {
      this.animationStepIdx ++;
      this.animateStep = this.battle.steps[this.animationStepIdx];
      setTimeout(() => this.setActiveHero(), 1000);
    } else {
      this.animateStep = null;
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

      if (this.activeHero) {
        this.selectedSkill = this.activeHero.heroBase.skills[0];
        if (this.autobattle) {
          this.takeAutoTurn();
        }
      } else {
        this.selectedSkill = null;
      }
    }
  }

  toggleAutobattle() {
    if (this.autobattle) {
      this.autobattle = false;
    } else {
      this.autobattle = true;
      this.takeAutoTurn();
    }
  }

  getSkills(): HeroSkill[] {
    return this.activeHero.heroBase.skills.filter(s => s.number === 1 || (this.activeHero['skill' + s.number + 'Lvl'] > 0 && this.activeHero['skill' + s.number + 'Cooldown'] >= 0));
  }

  selectSkill(skill: HeroSkill) {
    this.selectedSkill = skill;
  }

  selectable(hero: BattleHero): boolean {
    if (this.animateStep == null && this.activeHero) {
      if (hero && this.selectedSkill) {
        if (this.isOpponent(hero)) {
          if (this.selectedSkill.target === 'OPP_IGNORE_TAUNT') {
            return true;
          } else if (this.selectedSkill.target === 'OPPONENT') {
            return this.anyOpponentTaunting() ? this.isTaunting(hero) : true;
          }
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

  isActive(hero: BattleHero): boolean {
    if (hero) {
      if (this.animateStep) {
        return this.animateStep.actingHero === hero.position;
      } else {
        return this.battle.activeHero === hero.position;
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

  isTaunting(hero: BattleHero): boolean {
    return hero && !!hero.buffs.find(b => b.buff === 'TAUNT_BUFF');
  }

  isAlive(hero: BattleHero): boolean {
    return hero && hero.status === 'ALIVE';
  }

  anyOpponentTaunting(): boolean {
    return (this.isAlive(this.battle.oppHero1) && this.isTaunting(this.battle.oppHero1)) ||
        (this.isAlive(this.battle.oppHero2) && this.isTaunting(this.battle.oppHero2)) ||
        (this.isAlive(this.battle.oppHero3) && this.isTaunting(this.battle.oppHero3)) ||
        (this.isAlive(this.battle.oppHero4) && this.isTaunting(this.battle.oppHero4));
  }

  selectTarget(hero: BattleHero) {
    this.lastKnownStepIdx = this.battle.steps.length - 1;
    this.loading = true;
    this.backendService.takeTurn(this.battle, this.activeHero, this.selectedSkill, hero).subscribe(data => {
      this.model.ongoingBattle = data;
      this.initBattle(data);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.alertCtrl.create({
        header: 'Server error',
        message: error.error.message,
        buttons: [{text: 'Okay'}]
      }).then(data => data.present());
    });
  }

  takeAutoTurn() {
    if (this.battle.status === 'PLAYER_TURN') {
      this.lastKnownStepIdx = this.battle.steps.length - 1;
      this.loading = true;
      this.backendService.takeAutoTurn(this.battle, this.activeHero).subscribe(data => {
        this.model.ongoingBattle = data;
        this.initBattle(data);
        this.loading = false;
      }, error => {
        this.loading = false;
        this.alertCtrl.create({
          header: 'Server error',
          message: error.error.message,
          buttons: [{text: 'Okay'}]
        }).then(data => data.present());
      });
    }
  }

  surrender() {
    if (this.battle.status === 'PLAYER_TURN') {
      this.loading = true;
      this.backendService.surrender(this.battle).subscribe(data => {
        this.model.ongoingBattle = data;
        this.initBattle(data);
        this.loading = false;
      }, error => {
        this.loading = false;
        this.alertCtrl.create({
          header: 'Server error',
          message: error.error.message,
          buttons: [{text: 'Okay'}]
        }).then(data => data.present());
      });
    }
  }

  getAnimateNumbers(position: string) {
    let numbers = [];
    if (this.animateStep) {
      this.animateStep.actions.filter(a => a.heroPosition === position).forEach(a => {
        if (a.healthDiff < 0) { numbers.push({css: 'RED', number: a.healthDiff}); }
        if (a.healthDiff > 0) { numbers.push({css: 'GREEN', number: '+' + a.healthDiff}); }
        if (a.armorDiff < 0) { numbers.push({css: 'BLUE', number: a.armorDiff}); }
        if (a.type === 'DODGED') { numbers.push({css: 'color-orange', number: 'dodged'}); }
      });
    }
    return numbers;
  }

  showExplosion(position: string): boolean {
    if (this.animateStep && this.animateStep.phase === 'MAIN') {
      return !!this.animateStep.actions.find(a => a.heroPosition === position && a.type === 'DAMAGE');
    }
    return false;
  }

  getAnimationHeroState(position: string) {
    if (this.animateStep) {
      return this.animateStep.heroStates.find(s => s.position === position);
    }
  }

  replay(index: number) {
    this.animationStepIdx = index - 1;
    setTimeout(() => {
      this.setActiveHero();
    }, 10);
  }

}
