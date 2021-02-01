import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SaveAdvicesComponent } from '../../modals/save-advices/save-advices.component';
import { ClearAdvicesComponent } from '../../modals/clear-advices/clear-advices.component';
import { UserService } from '../../services/user.service';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'advices',
  templateUrl: './advices.component.html',
  styleUrls: ['./advices.component.scss', '../pages.component.css']
})
export class AdvicesComponent implements OnInit {
  stateType = 0;
  startTime = new Date(new Date().setDate(new Date().getDate() - 7));;
  endTime = new Date();
  data = [];
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
    private activeModal: NgbActiveModal,
    public user: UserService) {
    this.common.refresh = this.refresh.bind(this);
    this.searchData();

  }

  refresh() {

    this.searchData();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  selectType(type) {
    console.log("type:", type.target.value);
    this.stateType = type.target.value;
  }


  searchData() {
    this.data = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this.valobj = {};
    let params = {
      status: this.stateType,
      startTime: this.common.dateFormatter(this.startTime),
      endTime: this.common.dateFormatter(this.endTime)
    }

    // const params = "status =" +  +
    //   "&startTime=" + this.common.dateFormatter(this.startTime) +
    //   "&endTime=" + this.common.dateFormatter(this.endTime);
    // console.log("param:", params);
    this.common.loading++;
    this.api.post('Drivers/getAdvicesInPeriod', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = [];

        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action'), hideHeader: true };
        this.table.data.headings['action'] = action;

        this.table.data.columns = this.getTableColumns();

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }


  getTableColumns() {

    let columns = [];
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      this.valobj['action'] = { class: '', icons: this.actionIcons(doc) };

      columns.push(this.valobj);

    });

    return columns;
  }


  actionIcons(details) {
    console.log("details:", details);

    let icons = [];

    icons.push(

      {
        class: "far fa-eye",
        action: this.adviceView.bind(this, details),
      },

      {
        class: "fas fa-user-check",
        action: this.clearAdvices.bind(this, details),
      }
    )
    if (details.Status == "Accept" || details.Status == "Reject") {
      icons.pop();
    }

    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }


  saveAdvices() {
    this.common.params = { refData: null };
    this.common.handleModalSize('class', 'modal-lg', '1100');
    const activeModal = this.modalService.open(SaveAdvicesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.searchData();
    });
  }
  clearAdvices(row) {
    let data = {
      id: row._id,
      typeId: row._advice_type_id
    }
    console.log("row:", data);
    this.common.params = { advice: data };
    const activeModal = this.modalService.open(ClearAdvicesComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.searchData();
    });
  }
  adviceView(row) {
    let dataparams = {
      view: {
        api: 'Drivers/getAdvicesSingleVehicle',
        param: {
          vId: row._vid,
          test1: 1,
          test2: 'Hello'
        },
      },
      delete: {
        // api: 'Drivers/deleteAdvice',
        // param: { id: "_id" }
      },
      title: "Advices View"
    }
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

}
