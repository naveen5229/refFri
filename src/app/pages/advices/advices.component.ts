import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SaveAdvicesComponent } from '../../modals/save-advices/save-advices.component';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'advices',
  templateUrl: './advices.component.html',
  styleUrls: ['./advices.component.scss', '../pages.component.css']
})
export class AdvicesComponent implements OnInit {
  stateType = null;
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
    public user: UserService) { }

  ngOnInit() {
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
    // let params={
    //   startTime:
    // }

    const params = "status =" + this.stateType +
      "&startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime);
    console.log("param:", params);
    this.common.loading++;
    this.api.get('Drivers/getAdvicesInPeriod?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
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
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      this.valobj['action'] = { class: '', icons: this.actionIcons(doc) };

      columns.push(this.valobj);

    });

    return columns;
  }


  actionIcons(details) {
    console.log("detatis Page:", details);
    let icons = [];

    // if (details._id) {
    //   icons.push(
    //     {
    //       class: "fa fa-window-close",
    //       action: this.remove.bind(this, details),
    //     }
    //   )
    // }
    // else {
    //   icons.push(
    //     {
    //       class: "fa fa-tachometer-alt",
    //       action: this.openOdoMeter.bind(this, details),
    //     }
    //   )
    // }

    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }






  saveAdvices() {
    const activeModal = this.modalService.open(SaveAdvicesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
}
