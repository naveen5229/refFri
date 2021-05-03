import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FoSiteCountComponent } from '../../modals/fo-site-count/fo-site-count.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vsc-diagnosis',
  templateUrl: './vsc-diagnosis.component.html',
  styleUrls: ['./vsc-diagnosis.component.scss', '../../pages/pages.component.css']
})
export class VscDiagnosisComponent implements OnInit {
  showTable = false;
  startDate = '';
  endDate = '';
  siteRule = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(
    public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal
  ) {
    this.endDate = this.common.dateFormatter(new Date());
    this.startDate = this.common.dateFormatter(new Date().setDate(new Date().getDate() - 15));
    this.getSiteRule()
    this.common.refresh = this.refresh.bind(this);

  }
  refresh() {
    console.log('Refresh');
    this.getSiteRule();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getSiteRule() {

    this.siteRule = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    let params = {
      start_time: this.startDate,
      end_time: this.endDate
    };
    this.common.loading++;
    this.api.post('HaltOperations/getSiteRule', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.siteRule = res['data'] || [];
        if (this.siteRule == null) {
          this.common.showToast('Record Empty!!');
          //this.showTable = false;
        } else {
          this.common.showToast(res['msg']);
          let first_rec = this.siteRule[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table.data.headings[key] = headerObj;
            }

          }
          this.table.data.columns = this.getTableColumns();
          //this.showTable = true;
          console.log("table:");
          console.log(this.table);

          //this.table = this.setTable();
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  getDate(flag) {
    this.common.params = { ref_page: 'fuel-analysis' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (flag == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('fromDate', this.startDate);
        }
        if (flag == 'end') {
          this.endDate = '';
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }


      }

    });

  }

  // setTable() {
  //   let headings = {
  //     id: { title: 'Id', placeholder: 'Id' },
  //     name: { title: 'Name', placeholder: 'Name' },
  //     loc_name: { title: 'Loc Name ', placeholder: 'LocName' },
  //     count: { title: 'Count ', placeholder: 'Count' },
  //     sumloads: { title: 'SumLoads', placeholder: 'SumLoads' },
  //     loadper: { title: 'LoadPer', placeholder: 'LoadPer' },

  //   };
  //   return {
  //     data: {
  //       headings: headings,
  //       columns: this.getTableColumns()
  //     },
  //     settings: {
  //       hideHeader: true,
  //       tableHeight: "72vh"

  //     }
  //   }
  // }
  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.siteRule.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {

        this.valobj[this.headings[j]] = { value: this.siteRule[i][this.headings[j]], class: 'black', action: '' };


      }
      this.valobj['style'] = { background: this.siteRule[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;

  }


  ShowData() {
    this.common.loading++;
    this.api.get('VehicleKpi/createMaster')
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg']);

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  autoReview() {
    this.common.loading++;
    this.api.get('AutoHalts/runAutoReviewScheduledActivity')
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg']);

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  removeSandwitchHalts() {
    this.common.loading++;
    this.api.get('AutoHalts/runSandwitchHalts')
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg']);

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  getfoSiteDetails() {
    const activeModal = this.modalService.open(FoSiteCountComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
  }

}
