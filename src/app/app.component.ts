import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {BackendService} from './services/backend.service';
import {Model} from './services/model.service';
import {PropertyService} from './services/property.service';

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
            path: '/herobase/',
            admin: true,
            open: false,
            icon: 'player',
            children: [
                {
                    title: 'Create',
                    url: '/herobase/create',
                    icon: 'person-add'
                },
                {
                    title: 'List',
                    url: '/herobase/list',
                    icon: 'list'
                }
            ]
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
        private propertyService: PropertyService,
        public model: Model,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.backendService.getPlayer().subscribe(() => {
                this.propertyService.loadInitialProperties();
                let path: string = window.location.pathname;
                this.pages.forEach(p => {
                    if (p.path && path.startsWith(p.path)) {
                        p.open = true;
                    }
                });
            }, error => {
                console.log('auth failed goto login page');
                this.router.navigateByUrl('/login');
            });

        });
    }
}
