import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'vehicle-odometer',
  templateUrl: './vehicle-odometer.component.html',
  styleUrls: ['./vehicle-odometer.component.scss', '../pages.component.css']
})
export class VehicleOdometerComponent implements OnInit {
  State = "1";
  vehicleId = null;
  vehicleRegno = null;
  startTime = new Date(new Date().setMonth(new Date().getMonth() - 1));;
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
    this.changeState();
  }

  ngOnInit() {
  }

  changeState() {
    console.log("state:", this.State);
    if (this.State == '0') {
      return;
    }
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

    const params = "isSummary=" + this.State +
      "&startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime);
    console.log("param:", params);
    this.common.loading++;
    this.api.get('Vehicles/showManualKmData?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);

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


  search() {
    const params = "vehicleId=" + this.vehicleId + "&isSummary=" + this.State +
      "&startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime);
    console.log("param:", params);
    this.common.loading++;
    this.api.get('Vehicles/showManualKmData?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);

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

        this.valobj['action'] = { class: '', icons: this.actionIcons(doc) };
      }

      columns.push(this.valobj);

    });

    return columns;
  }


  actionIcons(details) {
    let icons = [];


    icons.push(
      {
        class: "fa fa-window-close",
        action: this.remove.bind(this, details),
      }
    )
    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  remove(row) {
    console.log("row", row);
    return;

    let params = {
      id: row._id,
      vehicleId: row._vid,
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete Route ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('ViaRoutes/delete', params)
            .subscribe(res => {
              this.common.loading--;
              this.common.showToast(res['msg']);
              this.changeState();
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }


  getvehicleData(vehicle) {
    console.log("Data::", vehicle);
    this.vehicleId = vehicle.id;
    this.vehicleRegno = vehicle.regno;
    console.log('Vehicle Data: ', this.vehicleId);
  }

  refreshAuto() {
    let sugestionValue = document.getElementsByName("suggestion")[0]['value'];
    if (sugestionValue == '' || sugestionValue == null) {
      this.vehicleRegno = null;
      this.vehicleId = null;
    }
  }


}
