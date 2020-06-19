import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Hero} from '../domain/hero.model';
import {ConverterService} from '../services/converter.service';
import {HeroSkill} from '../domain/heroSkill.model';
import {Model} from '../services/model.service';
import {Gear} from '../domain/gear.model';
import {PropertyService} from '../services/property.service';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {SetsInfoModal} from '../common/setsInfo.modal';
import {GearInfoModal} from '../common/gearInfo.modal';
import {BuffInfoModal} from '../common/buffInfo.modal';
import {StoryService} from '../services/story.service';
import {EnumService} from '../services/enum.service';

@Component({
  selector: 'barracks',
  templateUrl: 'barracks.page.html',
  styleUrls: ['barracks.page.scss']
})
export class BarracksPage {

  selectedHero: Hero;
  tab = "stats";
  selectedSkill: HeroSkill;
  gearTypeFilter: string[] = [];
  gearSetFilter = "STONE_SKIN";

  buildingType = 'BARRACKS';
  enterStory = this.buildingType + '_ENTERED';
  canUpgradeBuilding = false;

  constructor(private backendService: BackendService,
              public converter: ConverterService,
              public model: Model,
              public enumService: EnumService,
              private router: Router,
              private propertyService: PropertyService,
              private modalCtrl: ModalController,
              private storyService: StoryService) {
    console.log("BarracksPage.constructor");
  }

  ionViewWillEnter() {
    if (this.model.player.serviceAccount) {
      if (!this.model.fights) {
        this.backendService.loadFights().subscribe(data => {
          this.model.fights = data;
        });
      }
    }
    if (this.model.heroes.length > 0) {
      this.selectHero(this.model.heroes[0]);
    }
    this.canUpgradeBuilding = this.propertyService.getUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;

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

  upgradeInProgress(): boolean {
    return this.getBuilding().upgradeTriggered && !this.model.upgrades.find(u => u.buildingType === this.buildingType && u.finished);
  }

  upgradeFinished(): boolean {
    return this.getBuilding().upgradeTriggered && !!this.model.upgrades.find(u => u.buildingType === this.buildingType && u.finished);
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  isConfiguredInFight(): boolean {
    if (this.model.player.serviceAccount && this.selectedHero && this.model.fights) {
      let id = this.selectedHero.id;
      return !!this.model.fights.find(f =>
        !!f.stages.find(s => s.hero1Id === id || s.hero2Id === id || s.hero3Id === id || s.hero4Id === id)
      );
    }
    return false;
  }

  openUpgradeModal() {
    this.modalCtrl.create({
      component: BuildingUpgradeModal,
      componentProps: {
        buildingType: this.buildingType
      }
    }).then(modal => {
      modal.onDidDismiss().then(() => this.ionViewWillEnter());
      modal.present();
    });
  }

  openBuffInfo() {
    this.modalCtrl.create({
      component: BuffInfoModal
    }).then(p => p.present());
  }

  openGearInfo() {
    this.modalCtrl.create({
      component: GearInfoModal
    }).then(p => p.present());
  }

  openSetsInfo() {
    this.modalCtrl.create({
      component: SetsInfoModal
    }).then(p => p.present());
  }

  selectHero(hero: Hero, keepFilter?: boolean) {
    this.selectedHero = hero;
    if (!keepFilter && hero.sets && hero.sets.length > 0) {
      this.gearSetFilter = hero.sets[0].gearSet;
    }
    this.selectSkill(!!this.selectedSkill ? this.selectedSkill.number : 1);
  }

  selectSkill(number: number) {
    this.selectedSkill = this.selectedHero.heroBase.skills.find(s => s.number === number);
    if (!this.selectedSkill) {
      this.selectedSkill = this.selectedHero.heroBase.skills[0];
    }
  }

  getSkills(): HeroSkill[] {
    return this.selectedHero.heroBase.skills.filter(s => s.skillActiveTrigger !== 'NPC_ONLY' || this.model.player.serviceAccount);
  }

  getSkillLevel(skill: HeroSkill): number {
    return this.selectedHero['skill' + skill.number] || 0;
  }

  betaTesterHeroLooseLevel() {
    this.backendService.betaTesterHeroLooseLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  betaTesterHeroGainLevel() {
    this.backendService.betaTesterHeroGainLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  betaTesterHeroLooseAscLevel() {
    this.backendService.betaTesterHeroLooseAscLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  betaTesterHeroGainAscLevel() {
    this.backendService.betaTesterHeroGainAscLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  heroGainSkillLevel() {
    this.backendService.heroGainSkillLevel(this.selectedHero, this.selectedSkill.number).subscribe(data => {
      this.selectHero(data);
    });
  }

  heroResetSkills() {
    this.backendService.heroResetSkills(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  gearFilter(type: string) {
    let idx = this.gearTypeFilter.indexOf(type);
    if (idx >= 0) {
      this.gearTypeFilter.splice(idx, 1);
    } else {
      this.gearTypeFilter.push(type);
    }
  }

  gearExclusiveFilter(type: string) {
    this.gearTypeFilter = [type];
  }

  setFilter(set: string) {
    this.gearSetFilter = set;
  }

  getAvailableGears(): Gear[] {
    let gear = this.model.gears.filter(g =>
        this.converter.rarityStars(g.rarity) <= this.selectedHero.stars && (this.gearTypeFilter.length === 0 || this.gearTypeFilter.indexOf(g.type) >= 0) && g.set === this.gearSetFilter);
    return gear.sort((a, b) => {
      let aStars = this.converter.rarityStars(a.rarity);
      let bStars = this.converter.rarityStars(b.rarity);
      if (aStars === bStars) {
        return b.statQuality - a.statQuality;
      } else {
        return bStars - aStars;
      }
    });
  }
}
