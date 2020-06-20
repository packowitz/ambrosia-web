import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Hero} from '../domain/hero.model';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {StoryService} from '../services/story.service';
import {DynamicProperty} from '../domain/property.model';

@Component({
  selector: 'academy',
  templateUrl: 'academy.page.html'
})
export class AcademyPage {

  saving = false;
  selectedHero: Hero;

  feedForEvolve = false;

  totalXpGained = 0;
  xpGainCurrentLevel = 0;
  currentLevel = 0;
  currentLevelMaxXp = 0;

  totalAscGained = 0;
  ascGainCurrentLevel = 0;
  currentAscLevel = 0;
  currentAscLevelMaxPoints = 0;

  fodderSize = 6;
  fodder1: Hero;
  fodder2: Hero;
  fodder3: Hero;
  fodder4: Hero;
  fodder5: Hero;
  fodder6: Hero;

  buildingType = 'ACADEMY';
  enterStory = this.buildingType + '_ENTERED';

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              private propertyService: PropertyService,
              public model: Model,
              private router: Router,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private storyService: StoryService) {
    console.log("AcademyPage.constructor");
    if (!this.getBuilding()) {
      this.close();
    }
  }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.showStory();
    }
  }

  showStory() {
    this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
  }

  getUpgradeState(): string {
    if (this.upgradeInProgress()) { return 'in-progress'; }
    if (this.upgradeFinished()) { return 'done'; }
    if (this.canUpgradeBuilding()) { return 'possible'; }
    return 'not-possible';
  }

  getUpgradeCosts(): DynamicProperty[] {
    return this.propertyService.getUpgradeCosts(this.buildingType, this.getBuilding().level + 1);
  }

  canUpgradeBuilding(): boolean {
    let enoughResources = true;
    this.getUpgradeCosts().forEach(c => {
      if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
        enoughResources = false;
      }
    });
    return enoughResources;
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
  }

  upgradeInProgress(): boolean {
    return this.getBuilding().upgradeTriggered && !this.model.upgrades.find(u => u.buildingType === this.buildingType && u.finished);
  }

  upgradeFinished(): boolean {
    return this.getBuilding().upgradeTriggered && !!this.model.upgrades.find(u => u.buildingType === this.buildingType && u.finished);
  }

  openUpgradeModal() {
    this.modalCtrl.create({
      component: BuildingUpgradeModal,
      componentProps: {
        buildingType: this.buildingType
      }
    }).then(modal => {
      modal.present();
    });
  }

  resetFodder() {
    this.fodder1 = null;
    this.fodder2 = null;
    this.fodder3 = null;
    this.fodder4 = null;
    this.fodder5 = null;
    this.fodder6 = null;
    this.totalXpGained = 0;
    this.xpGainCurrentLevel = 0;
    this.currentLevel = 0;
    this.currentLevelMaxXp = 0;
    this.totalAscGained = 0;
    this.ascGainCurrentLevel = 0;
    this.currentAscLevel = 0;
    this.currentAscLevelMaxPoints = 0;
  }

  addedFodder(fodder: Hero) {
    if (!this.feedForEvolve) {
      this.totalXpGained += this.propertyService.getHeroMergeXp(fodder.level);
      this.calcXpLevel();
    }
    if (this.selectedHero.heroBase.heroClass === fodder.heroBase.heroClass) {
      this.totalAscGained += this.propertyService.getHeroMergeAsc(fodder.stars);
      this.calcAscLevel();
    }
  }

  removedFodder(fodder: Hero) {
    if (!this.feedForEvolve) {
      this.totalXpGained -= this.propertyService.getHeroMergeXp(fodder.level);
      this.calcXpLevel();
    }
    if (this.selectedHero.heroBase.heroClass === fodder.heroBase.heroClass) {
      this.totalAscGained -= this.propertyService.getHeroMergeAsc(fodder.stars);
      this.calcAscLevel();
    }
  }

  calcXpLevel() {
    this.currentLevel = this.selectedHero.level;
    this.currentLevelMaxXp = this.selectedHero.maxXp;
    this.xpGainCurrentLevel = this.totalXpGained;
    let diffToMax = this.selectedHero.maxXp - this.selectedHero.xp;
    while (this.xpGainCurrentLevel > diffToMax) {
      if (this.currentLevel % 10 !== 0) {
        this.xpGainCurrentLevel -= diffToMax;
        this.currentLevel ++;
        this.currentLevelMaxXp = this.propertyService.getHeroMaxXp(this.currentLevel);
        diffToMax = this.currentLevelMaxXp;
      } else {
        this.xpGainCurrentLevel = this.currentLevelMaxXp;
      }
    }
  }

  calcAscLevel() {
    this.currentAscLevel = this.selectedHero.ascLvl;
    this.currentAscLevelMaxPoints = this.selectedHero.ascPointsMax;
    this.ascGainCurrentLevel = this.totalAscGained;
    let diffToMax = this.selectedHero.ascPointsMax - this.selectedHero.ascPoints;
    while (this.ascGainCurrentLevel > diffToMax) {
      if (this.currentAscLevel < this.selectedHero.heroBase.maxAscLevel) {
        this.ascGainCurrentLevel -= diffToMax;
        this.currentAscLevel ++;
        this.currentAscLevelMaxPoints = this.propertyService.getHeroMaxAsc(this.currentAscLevel);
        diffToMax = this.currentAscLevelMaxPoints;
      } else {
        this.ascGainCurrentLevel = this.currentAscLevelMaxPoints;
      }
    }
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  selectHero(hero: Hero) {
    if (hero.missionId) { return; }
    if (this.selectedHero && this.selectedHero.id === hero.id) {
      this.selectedHero = null;
      this.resetFodder();
    } else if (this.fodder1 && this.fodder1.id === hero.id) {
      this.fodder1 = null;
      this.removedFodder(hero);
    } else if (this.fodder2 && this.fodder2.id === hero.id) {
      this.fodder2 = null;
      this.removedFodder(hero);
    } else if (this.fodder3 && this.fodder3.id === hero.id) {
      this.fodder3 = null;
      this.removedFodder(hero);
    } else if (this.fodder4 && this.fodder4.id === hero.id) {
      this.fodder4 = null;
      this.removedFodder(hero);
    } else if (this.fodder5 && this.fodder5.id === hero.id) {
      this.fodder5 = null;
      this.removedFodder(hero);
    } else if (this.fodder6 && this.fodder6.id === hero.id) {
      this.fodder6 = null;
      this.removedFodder(hero);
    } else {
      if (!this.selectedHero) {
        if (hero.level > this.model.progress.maxTrainingLevel) {
          this.alertCtrl.create({
            subHeader: 'You cannot train or evolve heroes of level higher than ' + this.model.progress.maxTrainingLevel + '. You need to upgrade Academy.',
            buttons: [{text: 'OK'}]
          }).then(alert => alert.present());
        } else {
          this.selectedHero = hero;
          this.currentLevel = hero.level;
          this.currentLevelMaxXp = hero.maxXp;
          this.currentAscLevel = hero.ascLvl;
          this.currentAscLevelMaxPoints = hero.ascPointsMax;
          if (hero.xp === hero.maxXp && hero.level === 10 * hero.stars) {
            this.feedForEvolve = true;
            console.log("set fodder size for evolve to " + hero.stars);
            this.fodderSize = hero.stars;
          } else {
            this.feedForEvolve = false;
            console.log("set fodder size for levelUp to 6");
            this.fodderSize = 6;
          }
        }
      } else if (this.feedForEvolve && hero.stars < this.selectedHero.stars) {
        this.alertCtrl.create({
          subHeader: 'To evolve a hero you need to sacrifice heroes of at least the same amount of stars',
          buttons: [{text: 'OK'}]
        }).then(alert => alert.present());
      } else if (!this.fodder1 && this.fodderSize >= 1) {
        this.fodder1 = hero;
        this.addedFodder(hero);
      } else if (!this.fodder2 && this.fodderSize >= 2) {
        this.fodder2 = hero;
        this.addedFodder(hero);
      } else if (!this.fodder3 && this.fodderSize >= 3) {
        this.fodder3 = hero;
        this.addedFodder(hero);
      } else if (!this.fodder4 && this.fodderSize >= 4) {
        this.fodder4 = hero;
        this.addedFodder(hero);
      } else if (!this.fodder5 && this.fodderSize >= 5) {
        this.fodder5 = hero;
        this.addedFodder(hero);
      } else if (!this.fodder6 && this.fodderSize >= 6) {
        this.fodder6 = hero;
        this.addedFodder(hero);
      }
    }
  }

  feedHeroesForXp() {
    this.saving = true;
    this.backendService.feedHeroesForXp(this.selectedHero, this.fodder1, this.fodder2, this.fodder3, this.fodder4, this.fodder5, this.fodder6).subscribe(data => {
      this.saving = false;
      this.selectedHero = null;
      this.resetFodder();
      this.selectHero(data.heroes[0]);
    });
  }

  feedHeroesForEvolve() {
    this.saving = true;
    this.backendService.feedHeroesForEvolve(this.selectedHero, this.fodder1, this.fodder2, this.fodder3, this.fodder4, this.fodder5, this.fodder6).subscribe(data => {
      this.saving = false;
      this.selectedHero = null;
      this.resetFodder();
      this.selectHero(data.heroes[0]);
    });
  }

  evolveDisabled(): boolean {
    switch (this.fodderSize) {
      case 1: return !this.fodder1;
      case 2: return !this.fodder1 || !this.fodder2;
      case 3: return !this.fodder1 || !this.fodder2 || !this.fodder3;
      case 4: return !this.fodder1 || !this.fodder2 || !this.fodder3 || !this.fodder4;
      case 5: return !this.fodder1 || !this.fodder2 || !this.fodder3 || !this.fodder4 || !this.fodder5;
      case 6: return !this.fodder1 || !this.fodder2 || !this.fodder3 || !this.fodder4 || !this.fodder5 || !this.fodder6;
    }
    return true;
  }

  getFodder(): Hero[] {
    let fodder = [this.fodder1];
    if (this.fodderSize >= 2) { fodder.push(this.fodder2); }
    if (this.fodderSize >= 3) { fodder.push(this.fodder3); }
    if (this.fodderSize >= 4) { fodder.push(this.fodder4); }
    if (this.fodderSize >= 5) { fodder.push(this.fodder5); }
    if (this.fodderSize >= 6) { fodder.push(this.fodder6); }
    return fodder;
  }
}
