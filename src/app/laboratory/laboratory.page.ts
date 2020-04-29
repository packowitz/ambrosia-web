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

@Component({
  selector: 'laboratory',
  templateUrl: 'laboratory.page.html'
})
export class LaboratoryPage {

  saving = false;

  buildingType = "LABORATORY";
  canUpgradeBuilding = false;

  hero: Hero;

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              private propertyService: PropertyService,
              public model: Model,
              private router: Router,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
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

  incubationtime(genome: string): string {
    return this.converter.timeWithUnit(this.propertyService.getIncubationTime(genome)[0].value1);
  }

  genomesNeeded(genome: string): number {
    let props = this.propertyService.getIncubationCosts(genome);
    if (props && props.length > 0) {
      return props[0].value1;
    }
    return 9999;
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