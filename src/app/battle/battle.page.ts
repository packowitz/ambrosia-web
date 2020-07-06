import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {Battle} from '../domain/battle.model';
import {BattleHero} from '../domain/battleHero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {BackendService} from '../services/backend.service';
import {BattleStep} from '../domain/battleStep.model';
import {Router} from '@angular/router';
import {StoryService} from '../services/story.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.page.html',
  styleUrls: ['./battle.page.scss'],
})
export class BattlePage {

  battle: Battle;
  battleSteps: BattleStep[] = [];
  activeHero: BattleHero;
  selectedSkill: HeroSkill;

  animateStep: BattleStep = null;
  lastKnownStepIdx = -1;
  animationStepIdx = -1;

  autobattle = false;
  loading = false;

  nextStageBattle: Battle = null;
  loadingNextStageInitiated = false;

  enterStory = 'BATTLE_ENTERED';
  fightLostStory = 'CAMPAIGN_FIGHT_LOST';

  constructor(public model: Model,
              private backendService: BackendService,
              private storyService: StoryService,
              private router: Router,
              private alertCtrl: AlertController) {}

  ionViewDidEnter() {
    console.log('Battle ionViewDidEnter for battle #' + !!this.model.ongoingBattle ? this.model.ongoingBattle.id : 'unknown');
    this.resetBattle(this.model.ongoingBattle);
  }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.showStory();
    }
  }

  showStory() {
    this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
  }

  resetBattle(battle: Battle) {
    this.battleSteps = [];
    this.activeHero = null;
    this.selectedSkill = null;
    this.lastKnownStepIdx = -1;
    this.animationStepIdx = -1;
    this.nextStageBattle = null;
    this.initBattle(battle);
  }

  initBattle(battle: Battle) {
    if (battle) {
      this.battle = battle;
      if (battle.steps) {
        if (this.battleSteps.length === 0) {
          this.battleSteps = battle.steps;
        } else {
          this.battleSteps = this.battleSteps.concat(battle.steps);
        }
      }
      if (this.battle.nextBattleId) {
        this.activateNextStageBattle();
      }
      this.setActiveHero();
    }
  }

  setActiveHero() {
    // animation
    if (this.animationStepIdx < this.battleSteps.length - 1) {
      this.animationStepIdx ++;
      this.animateStep = this.battleSteps[this.animationStepIdx];
      setTimeout(() => this.setActiveHero(), 1000);
    } else {
      this.animateStep = null;
      if (this.battle.status === 'STAGE_PASSED') {
        this.activateNextStageBattle();
      }
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

  activateNextStageBattle() {
    if (!this.nextStageBattle && !this.loadingNextStageInitiated) {
      this.loadingNextStageInitiated = true;
      this.backendService.getBattle(this.battle.nextBattleId).subscribe(data => {
        this.nextStageBattle = data.ongoingBattle;
        this.loadingNextStageInitiated = false;
        this.activateNextStageBattle();
      });
    } else {
      if (!this.animateStep) {
        setTimeout(() => {
          this.resetBattle(this.nextStageBattle);
        }, 1000);
      } else {
        setTimeout(() => {
          this.activateNextStageBattle();
        }, 100);
      }
    }
  }

  toggleAutobattle() {
    if (this.autobattle) {
      this.autobattle = false;
    } else {
      this.autobattle = true;
      if (!this.loading && !this.animateStep) {
        this.takeAutoTurn();
      }
    }
  }

  getSkills(): HeroSkill[] {
    return this.activeHero.heroBase.skills.filter(s => s.number === 1 || (this.activeHero['skill' + s.number + 'Lvl'] > 0));
  }

  selectSkill(skill: HeroSkill) {
    this.selectedSkill = skill;
  }

  selectable(hero: BattleHero): boolean {
    if (this.animateStep == null && this.activeHero && this.selectedSkill.passive === false && (this.selectedSkill.number === 1 || this.activeHero['skill' + this.selectedSkill.number + 'Cooldown'] === 0)) {
      if (hero && this.selectedSkill) {
        if (this.isOpponent(hero)) {
          if (hero.status !== 'DEAD') {
            if (this.selectedSkill.target === 'OPP_IGNORE_TAUNT') {
              return true;
            } else if (this.selectedSkill.target === 'OPPONENT') {
              return this.anyOpponentTaunting() ? this.isTaunting(hero) : true;
            }
          }
        } else {
          if (hero.position === this.activeHero.position) {
            return this.selectedSkill.target === 'SELF' || this.selectedSkill.target === 'ALL_OWN';
          } else if (hero.status === 'DEAD') {
            return this.selectedSkill.target === 'DEAD';
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
    return this.isAlive(hero) && !!hero.buffs.find(b => b.buff === 'TAUNT_BUFF');
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
    this.lastKnownStepIdx = this.battleSteps.length - 1;
    this.loading = true;
    this.backendService.takeTurn(this.battle, this.activeHero, this.selectedSkill, hero).subscribe(data => {
      this.initBattle(data.ongoingBattle);
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  takeAutoTurn() {
    if (this.battle.status === 'PLAYER_TURN') {
      this.lastKnownStepIdx = this.battleSteps.length - 1;
      this.loading = true;
      this.backendService.takeAutoTurn(this.battle, this.activeHero).subscribe(data => {
        this.initBattle(data.ongoingBattle);
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    }
  }

  surrender() {
    this.alertCtrl.create({
      subHeader: 'Are you sure to surrender?',
      buttons: [
        {text: 'Cancel'},
        {text: 'Surrender', handler: () => {
          this.loading = true;
          this.backendService.surrender(this.battle).subscribe(data => {
            this.initBattle(data.ongoingBattle);
            this.loading = false;
          }, () => {
            this.loading = false;
          });
        }}
      ]
    }).then(a => a.present());
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

  leaveBattle() {
    if (this.battle.type === 'TEST' && this.battle.fight) {
      this.battle = null;
      this.model.ongoingBattle = null;
      this.router.navigateByUrl('/fights/' + this.battle.fight.id);
    } else {
      if (this.battle.status === 'LOST' && !!this.battle.fight && this.storyService.storyUnknown(this.fightLostStory)) {
        this.storyService.showStory(this.fightLostStory).subscribe(() => console.log(this.fightLostStory + ' story finished'));
      }
      this.battle = null;
      this.model.ongoingBattle = null;
      this.router.navigateByUrl('/home');
    }
  }

  repeatBattle(event) {
    event.stopPropagation();
    this.loading = true;
    this.backendService.repeatTestFight(this.battle.id).subscribe(data => {
      this.autobattle = false;
      this.resetBattle(data.ongoingBattle);
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }
}
