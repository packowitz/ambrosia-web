import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {Router} from '@angular/router';
import {Dungeon} from '../domain/dungeon.model';

@Component({
  selector: 'dungeons',
  templateUrl: 'dungeons.page.html'
})
export class DungeonsPage implements OnInit {

  saving = false;

  serviceAccount: Player;

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

  gotoDungeonDetails(dungeon: Dungeon) {
    this.router.navigateByUrl('/dungeons/' + dungeon.id);
  }

  newDungeon() {
    this.alertCtrl.create({
      subHeader: 'New dungeon using service account ' + this.serviceAccount.name,
      inputs: [
        {
          name: 'name',
          label: 'Name',
          type: 'text'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.name) {
              this.saving = true;
              this.backendService.createDungeon(data.name, this.serviceAccount).subscribe(dungeon => {
                this.model.dungeons.push(dungeon);
                this.saving = false;
              });
            }
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }
}
