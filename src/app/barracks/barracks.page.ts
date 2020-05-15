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

  buildingType = 'BARRACKS';
  canUpgradeBuilding = false;

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              public model: Model,
              private router: Router,
              private propertyService: PropertyService,
              private modalCtrl: ModalController) {
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
      this.selectedHero = this.model.heroes[0];
      this.selectSkill(1);
    }
    this.canUpgradeBuilding = this.propertyService.getUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
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

  selectHero(hero: Hero) {
    this.selectedHero = hero;
    this.selectSkill(this.selectedSkill.number);
  }

  selectSkill(number: number) {
    this.selectedSkill = this.selectedHero.heroBase.skills.find(s => s.number === number);
    if (!this.selectedSkill) {
      this.selectedSkill = this.selectedHero.heroBase.skills[0];
    }
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

  getAvailableGears(): Gear[] {
    if (this.gearTypeFilter.length > 0) {
      return this.model.gears.filter(g => this.converter.rarityStars(g.rarity) <= this.selectedHero.stars && this.gearTypeFilter.indexOf(g.type) >= 0);
    } else {
      return this.model.gears.filter(g => this.converter.rarityStars(g.rarity) <= this.selectedHero.stars);
    }
  }
}
