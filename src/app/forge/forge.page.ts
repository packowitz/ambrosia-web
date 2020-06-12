import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
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
import {StoryService} from '../services/story.service';

@Component({
  selector: 'forge',
  templateUrl: 'forge.page.html'
})
export class ForgePage {

  saving = false;

  showSimple = true;
  showCommon = false;
  showUncommon = false;
  showRare = false;
  showEpic = false;
  showLegendary = false;

  allQualities = ['SHABBY', 'RUSTY', 'ORDINARY', 'USEFUL', 'GOOD', 'AWESOME', 'FLAWLESS', 'PERFECT', 'GODLIKE'];
  qualities = ['SHABBY', 'RUSTY', 'ORDINARY', 'USEFUL'];
  sets: string[] = [];

  buildingType = "FORGE";
  enterStory = this.buildingType + '_ENTERED';

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              public propertyService: PropertyService,
              public model: Model,
              public enumService: EnumService,
              private router: Router,
              private modalCtrl: ModalController,
              private popoverCtrl: PopoverController,
              private storyService: StoryService) {
    if (!this.getBuilding()) {
      this.close();
    }
    this.model.gears.forEach(g => {
      let stars = this.converter.rarityStars(g.rarity);
      this.showCommon = this.showCommon || stars >= 3;
      this.showUncommon = this.showUncommon || stars >= 4;
      this.showRare = this.showRare || stars >= 5;
      this.showEpic = this.showEpic || stars >= 6;
    });
    this.sets = converter.dataClone(this.enumService.getGearSets());
  }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.showStory();
    }
    this.model.gears.forEach(g => g.markedToBreakdown = false);
  }

  canUpgradeBuilding(): boolean {
    return this.propertyService.getUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;
  }

  showStory() {
    this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  toggleQuality(qual) {
    let idx = this.qualities.indexOf(qual);
    if (idx >= 0) {
      this.qualities.splice(idx, 1);
    } else {
      this.qualities.push(qual);
    }
  }

  toggleSet(set) {
    let idx = this.sets.indexOf(set);
    if (idx >= 0) {
      this.sets.splice(idx, 1);
    } else {
      this.sets.push(set);
    }
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
    let gear = this.model.gears.filter(g => {
      if (g.markedToBreakdown === true) { return true; }
      if (g.rarity === 'SIMPLE' && !this.showSimple) { return false; }
      if (g.rarity === 'COMMON' && !this.showCommon) { return false; }
      if (g.rarity === 'UNCOMMON' && !this.showUncommon) { return false; }
      if (g.rarity === 'RARE' && !this.showRare) { return false; }
      if (g.rarity === 'EPIC' && !this.showEpic) { return false; }
      if (g.rarity === 'LEGENDARY' && !this.showLegendary) { return false; }
      if (this.sets.indexOf(g.set) === -1) { return false; }
      if (this.qualities.indexOf(g.gearQuality) === -1) { return false; }
      return true;
    });
    return gear.sort((a, b) => {
      let aStars = this.converter.rarityStars(a.rarity);
      let bStars = this.converter.rarityStars(b.rarity);
      if (aStars === bStars) {
        return a.statQuality - b.statQuality;
      } else {
        return aStars - bStars;
      }
    });
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

  markAllForBreakdown() {
    this.getGear().forEach(g => g.markedToBreakdown = true);
  }

  breakdown() {
    let gears = this.gearForBreakdown();
    if (gears.length > 0) {
      this.saving = true;
      this.backendService.breakdownGear(gears).subscribe(data => {
        this.saving = false;
      });
    }
  }
}
