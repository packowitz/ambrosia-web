import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {OddJobBase} from '../domain/oddJobBase.model';
import {LootSelectionPopover} from '../common/loot-selection.popover';
import {PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'odd-jobs',
  templateUrl: 'oddJobs.page.html'
})
export class OddJobsPage implements OnInit {

  saving = false;

  newOddJob: OddJobBase;

  constructor(private backendService: BackendService,
              public model: Model,
              public enumService: EnumService,
              private popoverCtrl: PopoverController,
              private router: Router) {
    this.initNewOddJob();
  }

  ngOnInit(): void {
    if (!this.model.oddJobBases) {
      this.backendService.loadOddJobBases().subscribe(data => {
        this.model.oddJobBases = data;
      });
    }
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  lootBoxSelection(oddJob: OddJobBase) {
    this.popoverCtrl.create({
      component: LootSelectionPopover,
      componentProps: {
        lootBoxType: 'ODD_JOB',
        selected: oddJob.lootBoxId
      }
    }).then(p => {
      p.onDidDismiss().then(data => {
        if (data && data.data && data.data.id) {
          oddJob.lootBoxId = data.data.id;
        }
      });
      p.present();
    });
  }

  lootBoxName(id: number): string {
    let box = this.model.lootBoxes.find(l => l.id === id);
    return box ? box.name : 'unknown';
  }

  gotoLootBox(lootBoxId: number) {
    this.router.navigateByUrl('/loot/box/' + lootBoxId);
  }

  initNewOddJob() {
    this.newOddJob = new OddJobBase();
    this.newOddJob.active = true;
    this.newOddJob.level = 1;
    this.newOddJob.jobAmount = 1;
  }

  oddJobIncomplete(oddJob: OddJobBase): boolean {
    return !oddJob.rarity ||
        !oddJob.jobType ||
        !oddJob.lootBoxId ||
        !oddJob.name ||
        oddJob.level <= 0 ||
        oddJob.level > 6 ||
        oddJob.jobAmount < 1;
  }

  saveOddJob(oddJob: OddJobBase) {
    this.saving = true;
    this.backendService.saveOddJobBase(oddJob).subscribe(data => {
      let idx = -1;
      if (oddJob.id) {
        idx = this.model.oddJobBases.findIndex(e => e.id === oddJob.id);
      } else {
        this.initNewOddJob();
      }
      if (idx !== -1) {
        this.model.oddJobBases[idx] = data;
      } else {
        this.model.oddJobBases.push(data);
      }
      this.saving = false;
    });
  }
}
