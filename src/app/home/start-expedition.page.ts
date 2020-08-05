import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Hero} from '../domain/hero.model';
import {Vehicle} from '../domain/vehicle.model';
import {PopoverController} from '@ionic/angular';
import {VehicleSelectionPopover} from '../garage/vehicle-selection-popover';
import {ConverterService} from '../services/converter.service';
import {Expedition} from '../domain/expedition.model';
import {Team} from '../domain/team.model';

@Component({
  selector: 'start-expedition',
  templateUrl: 'start-expedition.page.html'
})
export class StartExpeditionPage {

  blockView = false;

  saving = false;

  expedition: Expedition;

  vehicle?: Vehicle;
  hero1?: Hero;
  hero2?: Hero;
  hero3?: Hero;
  hero4?: Hero;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private router: Router,
              public model: Model,
              public enumService: EnumService,
              private popoverCtrl: PopoverController,
              private converter: ConverterService) {
  }

  ionViewWillEnter() {
    let expeditionId = Number(this.route.snapshot.paramMap.get('expeditionId'));
    this.expedition = this.model.expeditions.find(e => e.id === expeditionId);
    if (!this.expedition || this.model.playerExpeditions.findIndex(p => p.expeditionId === expeditionId) !== -1) {
      this.close();
    }
    this.vehicle = this.model.vehicles.find(v => v.slot && !v.missionId && !v.playerExpeditionId && !v.upgradeTriggered);
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  selectHero(hero: Hero) {
    if (!this.successfullyRemoved(hero)) {
      if (!this.hero1) {
        this.hero1 = hero;
      } else if (!this.hero2) {
        this.hero2 = hero;
      } else if (!this.hero3) {
        this.hero3 = hero;
      } else if (!this.hero4) {
        this.hero4 = hero;
      }
    }
  }

  selectVehicle() {
    this.popoverCtrl.create({
      component: VehicleSelectionPopover,
      componentProps: {
        vehiclesInSlot: true,
        showBusyVehicles: false
      }
    }).then(modal => {
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
          this.vehicle = dataReturned.data;
        }
      });
      modal.present();
    });
  }

  successfullyRemoved(hero: Hero): boolean {
    if (this.hero1 && this.hero1.id === hero.id) {
      this.hero1 = null;
      return true;
    }
    if (this.hero2 && this.hero2.id === hero.id) {
      this.hero2 = null;
      return true;
    }
    if (this.hero3 && this.hero3.id === hero.id) {
      this.hero3 = null;
      return true;
    }
    if (this.hero4 && this.hero4.id === hero.id) {
      this.hero4 = null;
      return true;
    }
    return false;
  }

  canStartExpedition(): boolean {
    return !!this.vehicle && (!!this.hero1 || !!this.hero2 || !!this.hero3 || !!this.hero4);
  }

  startExpedition() {
    if (this.canStartExpedition()) {
      this.saving = true;
      let team = new Team('EXPEDITION');
      team.vehicleId = this.vehicle.id;
      if (this.hero1) { team.hero1Id = this.hero1.id; }
      if (this.hero2) { team.hero2Id = this.hero2.id; }
      if (this.hero3) { team.hero3Id = this.hero3.id; }
      if (this.hero4) { team.hero4Id = this.hero4.id; }
      this.backendService.startExpedition(this.expedition, team).subscribe(data => {
        this.saving = false;
        this.router.navigateByUrl('/home');
      }, () => this.saving = false );
    }
  }

  getSelectedHeroes(): Hero[] {
    return [this.hero1, this.hero2, this.hero3, this.hero4];
  }
}
