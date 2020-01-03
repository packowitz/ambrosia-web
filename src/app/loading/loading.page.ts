import { Component, OnInit } from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {PropertyService} from '../services/property.service';
import {EnumService} from '../services/enum.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['loading.page.scss']
})
export class LoadingPage {

  playerLoaded = false;
  status = "Initializing Ambrosia";

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              private propertyService: PropertyService,
              private model: Model,
              private router: Router,
              private enumService: EnumService) {
    this.initApp();
  }

  initApp() {
    if (!this.playerLoaded) {
      this.loadPlayer();
    } else if (this.enumService.enumsLoaded < this.enumService.enumsTotal) {
      this.status = 'Waiting for static content to get loaded';
      while (this.enumService.enumsLoaded < this.enumService.enumsTotal && !this.enumService.enumsFailed) {
        setTimeout(() => this.initApp(), 200);
      }
      if (this.enumService.enumsFailed) {
        this.alertCtrl.create({
          subHeader: 'Failed to load static content from ambrosia server. Please reload page.'
        }).then(alert => alert.present());
      }
    } else {
      let path = localStorage.getItem('ambrosia-page-requested');
      if (path && path.length > 0 && path.startsWith('/') && path !== '/loading') {
        this.router.navigateByUrl(path);
      } else {
        this.router.navigateByUrl('/home');
      }
    }
  }

  loadPlayer() {
    this.status = 'Loading Player Data';
    this.backendService.getPlayer().subscribe(playerAction => {
      this.propertyService.loadInitialProperties();
      this.model.playerName = playerAction.player.name;
      this.model.playerId = playerAction.player.id;
      this.model.activeAccountId = playerAction.player.id;
      if (playerAction.player.admin) {
        this.backendService.getAllServiceAccounts().subscribe(data => {
          this.model.serviceAccounts = data;
        });
      }
      this.playerLoaded = true;
      console.log("LoadingPage.LoadPlayer successfully completed");
      this.initApp();
    }, error => {
      console.log('auth failed goto login page');
      this.router.navigateByUrl('/login');
    });
  }



}
