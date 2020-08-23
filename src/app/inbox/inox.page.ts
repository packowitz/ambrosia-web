import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {InboxMessage} from "../domain/inboxMessage.model";
import {ConverterService} from "../services/converter.service";

@Component({
  selector: 'inbox',
  templateUrl: 'inbox.page.html'
})
export class InboxPage {

  saving = false;

  constructor(private backendService: BackendService,
              public model: Model,
              public converter: ConverterService,
              private router: Router) {
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  getInboxMessages(): InboxMessage[] {
    return this.model.inboxMessages.filter(i => i.messageType === 'GOODS');
  }

  unclaimable(msg: InboxMessage): boolean {
    return msg.items.findIndex(item => item.type !== 'RESOURCE' || this.canClaimResource(item.resourceType)) === -1;
  }

  claimGoods(msg: InboxMessage) {
    this.saving = true;
    this.backendService.claimMessage(msg).subscribe(() => {
      this.saving = false;
    }, () => this.saving = false);
  }

  canClaimResource(type: string): boolean {
    if (type === 'PREMIUM_STEAM') { return (this.model.resources.premiumSteam < this.model.resources.premiumSteamMax); }
    if (type === 'PREMIUM_COGWHEELS') { return (this.model.resources.premiumCogwheels < this.model.resources.premiumCogwheelsMax); }
    if (type === 'PREMIUM_TOKENS') { return (this.model.resources.premiumTokens < this.model.resources.premiumTokensMax); }
    if (type === 'METAL') { return this.model.resources.metal < this.model.resources.metalMax; }
    if (type === 'IRON') { return this.model.resources.iron < this.model.resources.ironMax; }
    if (type === 'STEEL') { return this.model.resources.steel < this.model.resources.steelMax; }
    if (type === 'WOOD') { return this.model.resources.wood < this.model.resources.woodMax; }
    if (type === 'BROWN_COAL') { return this.model.resources.brownCoal < this.model.resources.brownCoalMax; }
    if (type === 'BLACK_COAL') { return this.model.resources.blackCoal < this.model.resources.blackCoalMax; }
    return true;
  }
}
