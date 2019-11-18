import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../../services/date.service';
import { DatePipe } from '@angular/common';
import { style } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';



@Component({
  selector: 'consolidate-fuel-average',
  templateUrl: './consolidate-fuel-average.component.html',
  styleUrls: ['./consolidate-fuel-average.component.scss']
})
export class ConsolidateFuelAverageComponent implements OnInit {

  startTime = null;
  endTime = null;
  consolFuelAvg = [];
  showTable = false;
  headings = [];
  probableIssue = [];
  table = {
    data: {
      headings: {
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public dateService: DateService,
    public user: UserService,
    private datePipe: DatePipe
  ) {
    let today = new Date();
    this.endTime = new Date(today);
    let day = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    this.startTime = new Date(today.getFullYear(), today.getMonth(), 1);
    //this.startTime = new Date(today.setDate(today.getDate() - day + 1));
    this.getConsolidateFuelAvg();
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnInit() {
  }


  refresh() {
    console.log('Refresh');
    this.getConsolidateFuelAvg();
  }
  getConsolidateFuelAvg() {

    if (this.startTime > this.endTime) {
      this.common.showToast('start date should be less than end date');
      return;
    }
    this.consolFuelAvg = [];
    this.headings = [];
    let startTime = this.common.dateFormatter(this.startTime);
    let endTime = this.common.dateFormatter(this.endTime);
    let params = {
      start_time: startTime,
      end_time: endTime
    };
    this.common.loading++;
    this.api.post('FuelDetails/getFuelAvgWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.consolFuelAvg = res['data'] || [];
        if (this.consolFuelAvg.length == 0 || res['data'] == null) {
          this.consolFuelAvg = [];
          this.common.showToast("Record Not Found !!");
          this.resetDisplayTable();
        }
        let first_rec = this.consolFuelAvg[0];
        console.log('first_Rec', first_rec);
        this.table.data.headings = {};
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let hdgobj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = hdgobj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  resetDisplayTable() {
    this.table = {
      data: {
        headings: {
        },
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }


  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getTableColumns() {
    let columns = [];

    for (let i = 0; i < this.consolFuelAvg.length; i++) {
      let probableVal = this.consolFuelAvg[i]['_is_probable_issue'];

      let valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        let val = this.consolFuelAvg[i][this.headings[j]];
        valobj[this.headings[j]] = { value: val, class: probableVal ? 'lightcoral' : 'black', action: this.vehicleFuelHistory.bind(this, this.consolFuelAvg[i]) };
      }
      columns.push(valobj);
    }
    return columns;

  }


  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Trip Profit And Loss";
        let time = "Start Date:" + this.datePipe.transform(this.startTime, 'dd-MM-yyyy h:mm:ss a') + "  End Date:" + this.datePipe.transform(this.endTime, 'dd-MM-yyyy h:mm:ss a');
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], time);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "FoName:" + fodata['name'];
        let center_heading = "Report:" + "Trip Profit And Loss";
        let time = "Start Date:" + this.datePipe.transform(this.startTime, 'dd-MM-yyyy h:mm:ss a') + "  End Date:" + this.datePipe.transform(this.endTime, 'dd-MM-yyyy h:mm:ss a');
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, null, time);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  vehicleFuelHistory(row) {
    console.log("row", row);
    let dataparams = {
      view: {
        api: 'Fuel/getFuelAvgLogsWrtVeh',
        param: {
          vehicleId: row._vehicle_id,
          startTime: row.start_time,
          endTime: row.end_time
        }
      },
      delete: {
        // api: 'Drivers/deleteAdvice',
        // param: { id: "_id" }
      },
      title: "Fuel Average Logs History"
    }
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

}
