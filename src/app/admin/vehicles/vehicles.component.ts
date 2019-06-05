import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleNextServiceDetailComponent } from '../../modals/vehicle-next-service-detail/vehicle-next-service-detail.component';
import { BulkVehicleNextServiceDetailComponent } from '../../modals/bulk-vehicle-next-service-detail/bulk-vehicle-next-service-detail.component';

@Component({
  selector: 'vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  title = '';
  showTable = false;
  data = [];
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

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {

    this.getVehiclesDetail();
  }


  ngOnInit() {
  }
  getVehiclesDetail() {
    this.common.loading++;
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
    this.api.get('Vehicles/vehiclesDetailView')
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        console.log("data:");
        console.log(this.data);
        if (this.data == null) {
          this.data = [];
          return;
        }
        let first_rec = this.data[0];
        console.log("first_Rec", first_rec);

        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
        console.log("table:");
        console.log(this.table);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.data.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        j
        if (this.headings[j] == 'Action') {
          this.valobj[this.headings[j]] = {
            value: '', isHTML: true, action: null, icons: [
              { class: 'fa fa-pencil-square-o  edit-btn', isHTML: `<h2>test</h2>`, action: this.OpenVehicleNextServiceModal.bind(this, this.data[i]) },
            ]
          }
        } else {
          this.valobj[this.headings[j]] = { value: this.data[i][this.headings[j]], class: 'black', action: '' };

        }
      }

      columns.push(this.valobj);
    }
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  OpenVehicleNextServiceModal(vehicle) {
    this.common.params = { vehicleId: vehicle._vid, vehicleNo: vehicle.Vehicle };
    console.log("vehicle", vehicle);
    let activeModal = this.modalService.open(VehicleNextServiceDetailComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(res => {
      if (res.data > 0) {
        this.getVehiclesDetail();
      }
      console.log('response----', res.data);
    });
  }

  openNextBulkUpdateModal() {
    const activeModal = this.modalService.open(BulkVehicleNextServiceDetailComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });
  }
}