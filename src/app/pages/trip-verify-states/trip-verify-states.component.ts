import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trip-verify-states',
  templateUrl: './trip-verify-states.component.html',
  styleUrls: ['./trip-verify-states.component.scss']
})
export class TripVerifyStatesComponent implements OnInit {

  verifyState = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.getPendingStates();

  }

  ngOnInit() {
  }



  getPendingStates() {

    this.common.loading++;

    this.api.get('vehicles/getPendingVehicleStates?', {})
      .subscribe(res => {
        this.common.loading--;
        this.verifyState = res['data'];
        let first_rec = this.verifyState[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {

            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;

          }


        }
        let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action') };
        this.table.data.headings['action'] = action;
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.verifyState);
    this.verifyState.map(doc => {
      console.log("Doc Data:", doc);
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

        this.valobj['action'] = { value: `'<i class="fa fa-pencil-square"></i>'`, isHTML: true, action: '', class: 'image text-center del' }

      }


      columns.push(this.valobj);
    });
    return columns;
  }

}
