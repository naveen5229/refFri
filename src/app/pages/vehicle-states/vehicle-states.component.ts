import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'vehicle-states',
  templateUrl: './vehicle-states.component.html',
  styleUrls: ['./vehicle-states.component.scss']
})
export class VehicleStatesComponent implements OnInit {
  startDate = new Date(new Date().setDate(new Date().getDate() - 3));
  endDate = new Date();
  vehicleId = null;
  stateType = "-1";
  stateTypes = [];
  vehicleStates = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination:true
    }
  };
  constructor( public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.getStates();
    this.common.refresh = this.refresh.bind(this);
   }

  ngOnInit() {
  }

  getStates() {
    this.api.get("Suggestion/getTypeMaster?typeId=13")
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.stateTypes = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  refresh() {

    this.getVehicleStates();
  }

  getVehicleStates() {
    this.vehicleStates = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination: true
      }
    };
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    console.log('start & end', startDate, endDate);
    let params = "vehicleId=" + this.vehicleId +
      "&startDate=" + startDate +
      "&endDate=" + endDate+
      "&stateId=" + this.stateType;
    console.log('params', params);
    ++this.common.loading;
    this.api.get('Vehicles/getVehicleState?' + params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        // this.vehicleId = -1;
        // this.vehicleStates = res['data'];
        //this.vehicleStates = JSON.parse(res['data']);
        this.vehicleStates = res['data'];
        //this.table = this.setTable();
        if (this.vehicleStates != null) {
          console.log('vehicleStates', this.vehicleStates);
          let first_rec = this.vehicleStates[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {

            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              if (key === 'Start Date' || key=== 'End Date') {
                headerObj['type'] = 'date';
              }
              this.table.data.headings[key] = headerObj;
            }

          }
          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);
        } else {
          this.common.showToast('No Record Found !!');
        }
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
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
    for (var i = 0; i < this.vehicleStates.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {   
          this.valobj[this.headings[j]] = { value: this.vehicleStates[i][this.headings[j]], class: 'black', action: '' };
      }
      this.valobj['style'] = { background: this.vehicleStates[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

 

}
