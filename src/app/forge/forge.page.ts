import {Component} from '@angular/core';
import {BackendService, Looted} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {ModalController, PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';
import {EnumService} from '../services/enum.service';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {Gear} from '../domain/gear.model';
import {GearModal} from '../barracks/gear.modal';
import {UpgradeModal} from '../common/upgrade.modal';
import {GearUpgradeModal} from './gearUpgrade.modal';
import {ModificationSelectionPopover} from './modification-selection-popover';

@Component({
  selector: 'forge',
  templateUrl: 'forge.page.html'
})
export class ForgePage {

  saving = false;

  looted: Looted[];

  buildingType = "FORGE";

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              public propertyService: PropertyService,
              public model: Model,
              public enumService: EnumService,
              private router: Router,
              private modalCtrl: ModalController,
              private popoverCtrl: PopoverController) {
  }

  canUpgradeBuilding(): boolean {
    return this.propertyService.getUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  openBuildingUpgradeModal() {
    this.modalCtrl.create({
      component: BuildingUpgradeModal,
      componentProps: {
        buildingType: this.buildingType
      }
    }).then(modal => modal.present() );
  }

  openGearUpgradeModal(gear: Gear, modification: string) {
    this.modalCtrl.create({
      component: GearUpgradeModal,
      componentProps: {
        gearId: gear.id,
        modification: modification
      }
    }).then(modal => modal.present() );
  }

  modificationSelection(gear: Gear, event: any) {
    this.popoverCtrl.create({
      component: ModificationSelectionPopover,
      event: event,
      componentProps: {
        gear: gear
      }
    }).then(modal => {
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
           this.openGearUpgradeModal(gear, dataReturned.data);
        }
      });
      modal.present();
    });
  }

  openUpgradeModal() {
    this.modalCtrl.create({
      component: UpgradeModal
    }).then(modal => modal.present() );
  }

  getGear(): Gear[] {
    return this.model.gears;
  }

  gearForBreakdown(): Gear[] {
    return this.model.gears.filter(g => g.markedToBreakdown === true);
  }

  modText(modification: string): string {
    if (modification === 'REROLL_QUALITY') { return 'Quality'; }
    if (modification === 'REROLL_STAT') { return 'Stat'; }
    if (modification === 'INC_RARITY') { return '+ rarity'; }
    if (modification === 'ADD_JEWEL') { return '+ jewel'; }
    if (modification === 'REROLL_JEWEL_1') { return 'Jewel 1'; }
    if (modification === 'REROLL_JEWEL_2') { return 'Jewel 2'; }
    if (modification === 'REROLL_JEWEL_3') { return 'Jewel 3'; }
    if (modification === 'REROLL_JEWEL_4') { return 'Jewel 4'; }
    if (modification === 'ADD_SPECIAL_JEWEL') { return '+ set jewel'; }
    return '';
  }

  showGearDetails(gear: Gear) {
    if (!gear.modificationInProgress && !gear.equippedTo) {
      this.modalCtrl.create({
        component: GearModal,
        componentProps: {
          gear: gear,
        }
      }).then(modal => modal.present());
    }
  }

  breakdown() {
    let gears = this.gearForBreakdown();
    if (gears.length > 0) {
      this.saving = true;
      this.backendService.breakdownGear(gears).subscribe(data => {
        this.saving = false;
        this.looted = data.looted;
      });
    }
  }
}
