import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'barracks',
  templateUrl: 'barracks.page.html',
  styleUrls: ['barracks.page.scss']
})
export class BarracksPage implements OnInit {

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

  ngOnInit(): void {
    console.log("BarracksPage.ngOnInit");
    if (this.model.heroes.length > 0) {
      this.selectedHero = this.model.heroes[0];
      this.selectSkill(1);
    }
  }

  ionViewWillEnter() {
    this.canUpgradeBuilding = this.propertyService.getUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
  }

  close() {
    this.router.navigateByUrl('/home');
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

  adminHeroLooseLevel() {
    this.backendService.adminHeroLooseLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  adminHeroGainLevel() {
    this.backendService.adminHeroGainLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  adminHeroLooseAscLevel() {
    this.backendService.adminHeroLooseAscLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  adminHeroGainAscLevel() {
    this.backendService.adminHeroGainAscLevel(this.selectedHero).subscribe(data => {
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
