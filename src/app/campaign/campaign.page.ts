import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {Router} from '@angular/router';
import {Dungeon} from '../domain/dungeon.model';

@Component({
  selector: 'campaign',
  templateUrl: 'campaign.page.html'
})
export class CampaignPage implements OnInit {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.model.dungeons) {
      this.saving = true;
      this.backendService.loadDungeons().subscribe(data => {
        this.model.dungeons = data;
        this.saving = false;
      });
    }
  }

  enterDungeon(dungeon: Dungeon) {
    this.router.navigateByUrl('/campaign/' + dungeon.id);
  }
}
