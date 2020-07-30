import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {OddJobBase} from '../domain/oddJobBase.model';
import {AchievementReward} from '../domain/achievementReward.model';

@Component({
  selector: 'achievements-page',
  templateUrl: 'achievements.page.html'
})
export class AchievementsPage implements OnInit {

  saving = false;

  newAchievementReward: AchievementReward;

  constructor(private backendService: BackendService,
              public model: Model,
              public enumService: EnumService) {
    this.initNewAchievementReward();
  }

  ngOnInit(): void {
    if (!this.model.allAchievementRewards) {
      this.backendService.loadAllAchievementRewards().subscribe(data => {
        this.model.allAchievementRewards = data;
      });
    }
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  initNewAchievementReward() {
    this.newAchievementReward = new AchievementReward();
    this.newAchievementReward.starter = false;
  }

  achievementRewardIncomplete(reward: AchievementReward): boolean {
    return !reward.name ||
        !reward.achievementType ||
        !reward.achievementAmount ||
        reward.achievementAmount <= 0 ||
        !reward.lootBoxId;
  }

  saveReward(reward: AchievementReward) {
    this.saving = true;
    this.backendService.saveAchievementReward(reward).subscribe(data => {
      let idx = -1;
      if (reward.id) {
        idx = this.model.allAchievementRewards.findIndex(a => a.id === reward.id);
      } else {
        this.initNewAchievementReward();
      }
      if (idx !== -1) {
        this.model.allAchievementRewards[idx] = data;
      } else {
        this.model.allAchievementRewards.push(data);
      }
      this.saving = false;
    });
  }
}
