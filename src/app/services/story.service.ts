import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendService} from './backend.service';
import {PopoverController} from '@ionic/angular';
import {StoryPopover} from '../common/story.popover';

@Injectable({
    providedIn: 'root'
})
export class StoryService {

    constructor(private backendService: BackendService,
                private popoverCtrl: PopoverController) {}


    storyUnknown(storyTrigger: string): boolean {
        return !localStorage.getItem('STORY_' + storyTrigger);
    }

    storyShown(storyTrigger: string) {
        localStorage.setItem('STORY_' + storyTrigger, 'true');
    }

    showStory(storyTrigger: string): Observable<any> {
        return new Observable(observer => {
            this.backendService.loadPlayerStory(storyTrigger).subscribe(data => {
                this.popoverCtrl.create({
                    component: StoryPopover,
                    componentProps: {
                        stories: data
                    },
                    cssClass: 'story-popover',
                    backdropDismiss: false
                }).then(p => {
                    p.onDidDismiss().then(() => {
                        this.storyShown(storyTrigger);
                        observer.next(true);
                        observer.complete();
                    });
                    p.present();
                });
            }, () => observer.complete());
        });
    }
}