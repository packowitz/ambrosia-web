import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {Router} from '@angular/router';
import {Fight} from '../domain/fight.model';

@Component({
  selector: 'fights',
  templateUrl: 'fights.page.html'
})
export class FightsPage implements OnInit {

  saving = false;

  serviceAccount: Player;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.model.fights) {
      this.saving = true;
      this.backendService.loadFights().subscribe(data => {
        this.model.fights = data;
        this.saving = false;
      });
    }
  }

  gotoFightDetails(fight: Fight) {
    this.router.navigateByUrl('/fights/' + fight.id);
  }

  newFight() {
    this.alertCtrl.create({
      subHeader: 'New fight using service account ' + this.serviceAccount.name,
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
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
              this.backendService.createFight(data.name, this.serviceAccount).subscribe(fight => {
                this.model.fights.push(fight);
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
