import {Component} from '@angular/core';

import {AlertController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {BackendService} from './services/backend.service';
import {Model} from './services/model.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public pages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'gemini'
        },
        {
            title: 'Properties',
            url: '/properties',
            icon: 'flower',
            admin: true
        },
        {
            title: 'Base heroes',
            url: '/herobase/list',
            path: '/herobase/',
            admin: true,
            open: false,
            icon: 'player',
            children: [
                {
                    title: 'Create',
                    url: '/herobase/create',
                    icon: 'person-add'
                }
            ]
        },
        {
            title: 'Fights',
            url: '/fights',
            icon: 'hydra',
            admin: true,
            open: false,
            children: [
                {
                    title: 'Configs',
                    url: '/fights/configs',
                    icon: 'cog'
                }
            ]
        },
        {
            title: 'Maps',
            url: '/maps',
            icon: 'honeycomb'
        },
        {
            title: 'Tavern',
            url: '/tavern',
            icon: 'beer'
        },
        {
            title: 'Barracks',
            url: '/barracks',
            icon: 'muscle-fat'
        },
        {
            title: 'Training',
            url: '/training',
            icon: 'crossed-axes'
        },
        {
            title: 'Ongoing Battle',
            url: '/battle',
            icon: 'dripping-sword'
        }
    ];

    constructor(
        private platform: Platform,
        private backendService: BackendService,
        public model: Model,
        private router: Router,
        private alertCtrl: AlertController
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log("App.initializeApp");
            let path: string = window.location.pathname;
            console.log("App.detected path: " + path);
            this.pages.forEach(p => {
                if (p.path && path.startsWith(p.path)) {
                    p.open = true;
                }
            });
            localStorage.setItem('ambrosia-page-requested', path);

            this.router.navigateByUrl('/loading');

        });
    }

    addServiceAccount() {
        this.alertCtrl.create({
            subHeader: 'New Service Account',
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
                            this.backendService.createServiceAccount(data.name);
                        }
                    }
                }
            ]
        }).then(alert => {
            alert.present();
        });
    }

    loadAccountData() {
        this.model.reset();
        if (this.model.playerId === this.model.activeAccountId) {
            this.model.player.serviceAccount = false;
            this.backendService.getPlayer().subscribe(data => {
                console.log("Using player account " + data.player.name + " #" + data.player.id);
            });
        } else {
            this.backendService.useServiceAccount(this.model.activeAccountId).subscribe(data => {
                console.log("Using service account " + data.player.name + " #" + data.player.id);
            });
        }
    }
}
