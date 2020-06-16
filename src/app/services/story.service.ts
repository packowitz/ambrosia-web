import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BackendService} from './backend.service';
import {PopoverController} from '@ionic/angular';
import {StoryPopover} from '../common/story.popover';
import {Model} from './model.service';

@Injectable({
    providedIn: 'root'
})
export class StoryService {

    constructor(private backendService: BackendService,
                private model: Model,
                private popoverCtrl: PopoverController) {}


    storyUnknown(storyTrigger: string): boolean {
        return this.model.knownStories.indexOf(storyTrigger) === -1;
    }

    showStory(storyTrigger: string): Observable<any> {
        return new Observable(observer => {
            this.backendService.loadPlayerStory(storyTrigger).subscribe(data => {
                if (data && data.length > 0) {
                    this.popoverCtrl.create({
                        component: StoryPopover,
                        componentProps: {
                            stories: data
                        },
                        cssClass: 'story-popover',
                        backdropDismiss: false
                    }).then(p => {
                        p.onDidDismiss().then(() => {
                            this.backendService.finishStory(storyTrigger).subscribe(() => {
                                observer.next(true);
                                observer.complete();
                            });
                        });
                        p.present();
                    });
                } else {
                    this.backendService.finishStory(storyTrigger).subscribe(() => {
                        observer.next(true);
                        observer.complete();
                    });
                }
            }, () => observer.complete());
        });
    }
}