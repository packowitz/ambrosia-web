import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Incubator} from '../domain/incubator.model';
import {Hero} from '../domain/hero.model';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {StoryService} from '../services/story.service';
import {BuildingService} from '../services/building.service';
import {LaboratoryUpgradeInfoModal} from './laboratory-upgrade-info.modal';

@Component({
  selector: 'laboratory',
  templateUrl: 'laboratory.page.html'
})
export class LaboratoryPage {

  saving = false;

  buildingType = "LABORATORY";
  enterStory = this.buildingType + '_ENTERED';

  hero: Hero;

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              private propertyService: PropertyService,
              public buildingService: BuildingService,
              public model: Model,
              private router: Router,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private storyService: StoryService) {
    if (!this.buildingService.getBuilding(this.buildingType)) {
      this.close();
    }
  }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
    }
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  showUpgradeInfo() {
    this.modalCtrl.create({component: LaboratoryUpgradeInfoModal}).then(m => m.present() );
  }

  showHeroOverview() {
    this.router.navigateByUrl('/laboratory/heroes');
  }

  info(text: string) {
    this.alertCtrl.create({
      subHeader: text
    }).then(a => a.present());
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

  incubationtime(genome: string): string {
    let time = this.propertyService.getIncubationTime(genome)[0].value1;
    let upChance = 0;
    let superUpChance = 0;
    let nextLevelTime = 0;
    let nextAfterLevelTime = 0;
    switch (genome) {
      case 'SIMPLE_GENOME': {
        upChance = this.model.progress.simpleIncubationUpPerMil;
        nextLevelTime = this.propertyService.getIncubationTime('COMMON_GENOME')[0].value1;
        break;
      }
      case 'COMMON_GENOME': {
        upChance = this.model.progress.commonIncubationUpPerMil;
        nextLevelTime = this.propertyService.getIncubationTime('UNCOMMON_GENOME')[0].value1;
        break;
      }
      case 'UNCOMMON_GENOME': {
        upChance = this.model.progress.uncommonIncubationUpPerMil;
        superUpChance = this.model.progress.uncommonIncubationSuperUpPerMil;
        nextLevelTime = this.propertyService.getIncubationTime('RARE_GENOME')[0].value1;
        nextAfterLevelTime = this.propertyService.getIncubationTime('EPIC_GENOME')[0].value1;
        break;
      }
      case 'RARE_GENOME': {
        upChance = this.model.progress.rareIncubationUpPerMil;
        nextLevelTime = this.propertyService.getIncubationTime('EPIC_GENOME')[0].value1;
        break;
      }
    }
    time += Math.round((upChance * nextLevelTime) / 100);
    time += Math.round((superUpChance * nextAfterLevelTime) / 100);
    time = Math.round((time * 100) / this.model.progress.labSpeed);
    return this.converter.timeWithUnit(time);
  }

  genomesNeeded(genome: string): number {
    switch (genome) {
      case 'SIMPLE_GENOME': return this.model.progress.simpleGenomesNeeded;
      case 'COMMON_GENOME': return this.model.progress.commonGenomesNeeded;
      case 'UNCOMMON_GENOME': return this.model.progress.uncommonGenomesNeeded;
      case 'RARE_GENOME': return this.model.progress.rareGenomesNeeded;
      case 'EPIC_GENOME': return this.model.progress.epicGenomesNeeded;
      default: return 9999;
    }
  }

  perMilToPercent(perMil: number): string {
    return (perMil / 10) + '%';
  }

  hasEnoughGenomes(genome: string): boolean {
    return this.model.hasEnoughResources(genome, this.genomesNeeded(genome));
  }

  canStartCloning(genome: string): boolean {
    if (this.model.incubators.length >= this.model.progress.incubators) {
      return false;
    }
    return this.hasEnoughGenomes(genome);
  }

  clone(genomeType: string) {
    this.saving = true;
    this.backendService.cloneHero(genomeType).subscribe(data => {
      this.saving = false;
      if (data.heroes && data.heroes.length > 0) {
        this.hero = data.heroes[0];
      }
    });
  }

  finishIncubation(incubator: Incubator) {
    if (incubator.finished) {
      this.saving = true;
      this.backendService.openIncubator(incubator.id).subscribe(data => {
        this.saving = false;
        if (data.heroes && data.heroes.length > 0) {
          this.hero = data.heroes[0];
        }
      });
    } else {
      this.alertCtrl.create({
        subHeader: 'Are you sure to cancel incubation?',
        buttons: [
          {text: 'Close'},
          {text: 'Yes', handler: () => {
            this.saving = true;
            this.backendService.cancelIncubator(incubator.id).subscribe(() => {
              this.saving = false;
            });
          }}
        ]
      }).then(alert => alert.present());
    }
  }
}
