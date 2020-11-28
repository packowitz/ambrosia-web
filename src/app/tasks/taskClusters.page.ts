import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {Router} from '@angular/router';
import {Fight} from '../domain/fight.model';
import {Map} from '../domain/map.model';
import {TaskCluster} from "../domain/taskCluster.model";
import {ConverterService} from "../services/converter.service";

@Component({
  selector: 'task-clusters',
  templateUrl: 'taskClusters.page.html'
})
export class TaskClustersPage {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService,
              public converter: ConverterService,
              private router: Router) {}

  clusterDetails(taskCluster: TaskCluster) {
    this.router.navigateByUrl('/tasks/' + taskCluster.id);
  }

  saveCluster(taskCluster: TaskCluster) {
    this.saving = true;
    this.backendService.saveTaskCluster(taskCluster).subscribe(data => {
      this.saving = false;
      this.model.updateTaskCluster(data);
    });
  }

  clustersByCategory(taskCategory: string): TaskCluster[] {
    return this.model.taskClusters
        .filter(c => c.category === taskCategory)
        .sort((a, b) => a.sortOrder - b.sortOrder);
  }
}
