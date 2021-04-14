import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FoUserStateComponent } from '../../modals/fo-user-state/fo-user-state.component';
import { CommonService } from '../../services/common.service';
import { ViewListComponent } from '@progress/kendo-angular-dateinputs';
import { GenericInputTypeComponent } from '../../modals/generic-modals/generic-input-type/generic-input-type.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'finance-recovery',
  templateUrl: './finance-recovery.component.html',
  styleUrls: ['./finance-recovery.component.scss']
})
export class FinanceRecoveryComponent implements OnInit {
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  recoveries = [];
  constructor(public api: ApiService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public common: CommonService) {
    this.getRecoveries();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getRecoveries();
  }

  getRecoveries() {
    const params = `branchId=${0}&accGroupId=${0}&ledgerId=${0}`;
    this.common.loading++;
    this.api.get("FinanceRecovery/getOutstandingCredit?" + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Res:", res);
        this.recoveries = res['data'] || [];
        this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
        console.log('Error:', err);
      });
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.genearateColumns()
    }
  }

  generateHeadings() {
    let headings = {};
    for (let key in this.recoveries[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  genearateColumns() {
    let columns = [];
    this.recoveries.map(recovery => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column['Action'] = { class: "fas fa-eye", action: this.showAction.bind(this, recovery._ledid) }
        } else if (key == "View Contacts") {
          column[key] = { value: 'show', class: (recovery._cc == "Black") ? "black" : (recovery._cc == "Red" )? "red" :( recovery._cc == "Blue") ? "blue" : (recovery._cc == "Green" ) ? "green" :(recovery._cc == "Light Green") ? "lightGreen" : (recovery._cc == "Purple") ? "purple" :(recovery._cc == "Yellow" ? "yellow" :""), action: this.customerMobileNo.bind(this) }
        } else if (key == "ledgername") {
          let icons = [
            { class: 'fa fa-bell', action: this.customerResponse.bind(this) },
            { txt: recovery[key] ,action: this.customerResponse.bind(this)}
          ];
          if (recovery._reminderflag != 1) icons.splice(0, 1);

          column[key] = {
            class: (recovery._cc == "Black") ? "black" : (recovery._cc == "Red" )? "red" :( recovery._cc == "Blue") ? "blue" : (recovery._cc == "Green" ) ? "green" :(recovery._cc == "Light Green") ? "lightGreen" : (recovery._cc == "Purple") ? "purple" :(recovery._cc == "Yellow" ? "yellow" :""),
            icons
          }
        } else {
          column[key] = { value: recovery[key], class: (recovery._cc == "Black") ? "black" : (recovery._cc == "Red" )? "red" :( recovery._cc == "Blue") ? "blue" : (recovery._cc == "Green" ) ? "green" :(recovery._cc == "Light Green") ? "lightGreen" : (recovery._cc == "Purple") ? "purple" :(recovery._cc == "Yellow" ? "yellow" :""), action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  customerResponse() {
    let data = {
      title: 'Customer Response',
      type: 'radio',
      apiData: null,
      radio1: 'Not Picking The Phone',
      radio2: 'Switch Off',
      radio3: 'Highly Negative Response',
      btn1: 'Cancel',
      btn2: 'Submit'
    }
    this.common.params = { data: data };
    this.modalService.open(GenericInputTypeComponent, { container: "nb-layout", size: 'sm', backdrop: 'static' });
  }

  customerMobileNo() {
    let data = {
      title: 'User mobile',
      type: 'text',
      apiData: null,

    };
    this.api.get('FinanceRecovery/getCompanyContacts').subscribe(res => {
      console.log('res', res['data']);
      data.apiData = res['data'][0].MobileNo;
      console.log('data api', data.apiData);
      this.common.params = { data: data };
      this.modalService.open(GenericInputTypeComponent, { container: "nb-layout", size: 'sm', backdrop: 'static' });

    }, err => {
      this.common.loading--;
      this.common.showError();
    });
  }



  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  showAction(_ledid) {
    this.common.params = {
      ledgerId: _ledid
    }
    console.log("params", this.common.params)
    const activeModal = this.modalService.open(FoUserStateComponent, {  container: "nb-layout" });
    activeModal.result.then(data => {
      console.log('res', data);

      this.getRecoveries();
    });

  }
}


