import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {Router} from '@angular/router';
import {Fight} from '../domain/fight.model';
import {Map} from '../domain/map.model';

@Component({
  selector: 'maps',
  templateUrl: 'maps.page.html'
})
export class MapsPage implements OnInit {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService,
              private router: Router) {
    console.log("MapsPage.constructor");
  }

  ngOnInit(): void {
    if (!this.model.maps) {
      this.saving = true;
      this.backendService.loadAllMaps().subscribe(data => {
        this.model.maps = data;
        this.saving = false;
      });
    }
  }

  newMap() {
    this.alertCtrl.create({
      subHeader: 'New map',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        },
        {
          name: 'width',
          placeholder: 'Width',
          type: 'number'
        },
        {
          name: 'height',
          placeholder: 'Height',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.name && data.width && data.height) {
              this.saving = true;
              this.backendService.createMap(data.name, data.width, data.height).subscribe(map => {
                this.model.maps.push(map);
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

  mapDetails(map: Map) {
    this.router.navigateByUrl('/maps/' + map.id);
  }
}
