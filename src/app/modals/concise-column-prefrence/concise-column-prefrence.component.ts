import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'concise-column-prefrence',
  templateUrl: './concise-column-prefrence.component.html',
  styleUrls: ['./concise-column-prefrence.component.scss']
})
export class ConciseColumnPrefrenceComponent implements OnInit {
  conciseData = [];
  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  columns = {
    selected: [
      { name: 'Vehicle No', title: 'Vehicle No', order: 1, key: 'vehicle', show: true },
      { name: 'Vehicle Type', title: 'Veh Type', order: 1, key: 'vehicleType', show: true },
      { name: 'Status', title: 'Status', order: 1, key: 'status', show: true },
      { name: 'Location', title: 'Location', order: 1, key: 'location', show: true },
      { name: 'Hrs', title: 'Hrs', order: 1, key: 'hrs', show: true },
      { name: 'Idle Time', title: 'Idle Time', order: 1, key: 'Idle_Time', show: true },
      { name: 'Trail', title: 'Trail', order: 1, key: 'trail', show: true },
      { name: 'KMP', title: 'KMP', order: 1, key: 'kmp', show: true },
    ],
    unSelected: []
  }


  constructor(
    public activeModal: NgbActiveModal,
    private common: CommonService
  ) {
    this.conciseData = this.common.params;
    delete this.common.params;
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close({ response: true });
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  savePreferences() {
    console.log('this.', this.columns);
    let columns = this.columns.selected
      .map((column, index) => {
        column.order = index + 1;
        column.show = true;
        return column;
      });
    columns.push(...this.columns.unSelected
      .map(column => {
        column.order = -1;
        column.show = false;
        return column;
      }));

    console.log(columns);
  }
}
