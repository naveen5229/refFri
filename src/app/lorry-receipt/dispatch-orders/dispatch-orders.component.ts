import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { eventNames } from 'cluster';

@Component({
  selector: 'dispatch-orders',
  templateUrl: './dispatch-orders.component.html',
  styleUrls: ['./dispatch-orders.component.scss']
})
export class DispatchOrdersComponent implements OnInit {

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
  dispatchOrders = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  }

  // todo = [
  //   'Get to work',
  //   'Pick up groceries',
  //   'Go home',
  //   'Fall asleep',
  //   'TEST'
  // ];

  todo = [
    {
      name:"kalpesh",
      id:'1',
      isRequired:true
    },
    {
      name:"Goutam",
      id:'2',
      isRequired:true
    },
    {
      name:"Jai Sir",
      id:'3',
      isRequired:false
    },
    {
      name:"Umang Sir",
      id:'4',
      isRequired:false
    },
    {
      name:"kuldeep",
      id:'5',
      isRequired:false
    },
  ]

  col1 = [null,null,null,null,null];

  col2 = [null,null,null,null,null];

  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal, ) {

  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log("drop", event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // transferArrayItem(event.previousContainer.data,
      //                   event.container.data,
      //                   event.previousIndex,
      //                   event.currentIndex);
    }
    if (event.container.id == "col2") {
      if (event.previousContainer.id == "col1") {
        let val = this.col2[event.currentIndex];
        this.col2[event.currentIndex] = this.col1[event.previousIndex];
        this.col1[event.previousIndex] = val;
      }
    }
    if (event.container.id == "col1") {
      if (event.previousContainer.id == "col2") {
        let val = this.col1[event.currentIndex];
        this.col1[event.currentIndex] = this.col2[event.previousIndex];
        this.col2[event.previousIndex] = val;
      }
    }
    if (event.container.id == "col1") {
      if (event.previousContainer.id == "unassign") {
        if (this.col1[event.currentIndex] == null) {
          this.col1[event.currentIndex] = this.todo[event.previousIndex];
          this.todo.splice(event.previousIndex, 1);
        }
      }
    }
    if (event.container.id == "col2") {
      if (event.previousContainer.id == "unassign") {
        if (this.col2[event.currentIndex] == null) {
          this.col2[event.currentIndex] = this.todo[event.previousIndex];
          this.todo.splice(event.previousIndex, 1);
        }
      }
    }
    if (event.container.id == "unassign") {
      if (event.previousContainer.id == "col1") {
        if (this.col1[event.previousIndex] != null)
          this.todo.push(this.col1[event.previousIndex]);
        this.col1[event.previousIndex] = '';
      }
    }
    if (event.container.id == "unassign") {
      if (event.previousContainer.id == "col2") {
        if (this.col2[event.previousIndex] != null)
          this.todo.push(this.col1[event.previousIndex]);
        this.col2[event.previousIndex] = '';
      }
    }

  }

  // getDispatchOrders() {
  //   let params = {
  //     startDate: this.common.dateFormatter(this.startDate),
  //     endDate: this.common.dateFormatter(this.endDate)
  //   }
  //   this.common.loading++;
  //   this.api.post('LorryReceiptsOperation/getDispatchOrders', params)
  //     .subscribe(res => {
  //       console.log('Res:', res);
  //       this.common.loading--;
  //       this.dispatchOrders = res['data'];
  //       if (!res['data']) {
  //         return;
  //       }
  //       this.clearAllTableData();
  //       this.setTable();
  //     },
  //       err => {
  //         this.common.loading--;
  //         this.common.showError(err);
  //       });
  // }
  // setTable() {
  //   this.table.data = {
  //     headings: this.generateHeadings(this.dispatchOrders[0]),
  //     columns: this.getColumns(this.dispatchOrders, this.dispatchOrders[0])
  //   };
  // }
  // generateHeadings(keyObject) {
  //   let headings = {};
  //   for (var key in keyObject) {
  //     if (key.charAt(0) != "_") {
  //       headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
  //     }
  //   }
  //   return headings;
  // }
  // formatTitle(title) {
  //   return title.charAt(0).toUpperCase() + title.slice(1)
  // }
  // getColumns(list, headings) {
  //   let columns = [];
  //   list.map(item => {
  //     let column = {};
  //     for (let key in this.generateHeadings(headings)) {
  //       if (key == "Action") {
  //         column[key] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: '' }, { class: 'fas fa-trash-alt', action: this.deleteDispatchOrder.bind(this) }] };
  //       } else {
  //         column[key] = { value: item[key], class: 'black', action: '' };
  //       }
  //     }
  //     columns.push(column);
  //   });
  //   return columns;
  // }

  // deleteDispatchOrder() {
  //   this.common.params = {
  //     title: 'Delete  ',
  //     description: `<b>` + 'Are you Sure To Delete This Record' + `<b>`,
  //   }
  //   const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
  //   activeModal.result.then(data => {
  //     if (data.response) {
  //     }
  //   });
  // }

  // clearAllTableData() {
  //   this.table = {
  //     data: {
  //       headings: {},
  //       columns: []
  //     },
  //     settings: {
  //       hideHeader: true
  //     }
  //   }
  // }
}
