import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {Router} from '@angular/router';
import {StoryService} from '../services/story.service';
import {BuildingService} from '../services/building.service';
import {EnumService} from '../services/enum.service';
import {ConverterService} from '../services/converter.service';

@Component({
  selector: 'app-bazaar',
  templateUrl: './bazaar.page.html'
})
export class BazaarPage {

  tab = 'merchant';
  saving = false;
  
  buildingType = 'BAZAAR';
  enterStory = this.buildingType + '_ENTERED';

  constructor(private model: Model,
              public enumService: EnumService,
              public converter: ConverterService,
              private backendService: BackendService,
              private storyService: StoryService,
              public buildingService: BuildingService,
              private router: Router) { }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.showStory();
    }
  }

  showStory() {
    this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  acceptTrade(tradeName: string) {
    this.saving = true;
    this.backendService.acceptTrade(tradeName).subscribe(data => {
      this.saving = false;
    }, () => this.saving = false );
  }

}
