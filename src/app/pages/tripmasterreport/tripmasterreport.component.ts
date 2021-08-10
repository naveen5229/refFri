import { Component, OnInit } from '@angular/core';
import { TripKmRepairViewComponent } from '../../modals/trip-km-repair-view/trip-km-repair-view.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TollpaymentmanagementComponent } from '../../modals/tollpaymentmanagement/tollpaymentmanagement.component';
import { RouteMapper } from '../../modals';
import { ExcelService } from '../../services/excel/excel.service';
import { CsvService } from '../../services/csv/csv.service';



@Component({
  selector: 'tripmasterreport',
  templateUrl: './tripmasterreport.component.html',
  styleUrls: ['./tripmasterreport.component.scss']
})

export class TripmasterreportComponent implements OnInit {

  tripData = [];
  tripMasterReportData = [];
  selectedVehicle = {
    id: 0
  };
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination: true,
    }
  };
  headings = [];
  valobj = {};

  startTime = new Date();
  endTime = new Date();

  constructor(public api: ApiService,
    public common: CommonService,
    private excelService: ExcelService,
    private csvService: CsvService,
    private modalService: NgbModal,
    public user: UserService) {
    let today = new Date();
    this.startTime = new Date(today.setDate(today.getDate() - 1));
  }

  ngOnInit(): void {
  }

  getVehicle(vehicle) {
    console.log('test fase', vehicle);
    this.selectedVehicle = vehicle;
    console.log('test fase', this.selectedVehicle.id);
  }

  getTripMasterReport() {
    const params = "vid=" + this.selectedVehicle.id + "&startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime);
    this.common.loading++;
    this.api.get('TripsOperation/getTripMasterReportv1?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.tripData = res['data'];
        let tripDataKey = this.tripData[0];
        console.log('response is: ', this.tripData);

        let headings = {};
        for (var key in tripDataKey) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            headings[key] = headerObj;
          }
        }
        this.table.data = {
          headings: headings,
          columns: this.getTableColumns()
        };
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  getTableColumns() {
    let columns = [];
    this.tripData.map(matrix => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] === 'AI Repaired Distance') {
          if (matrix[this.headings[i]] > 0) {
            this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.openTripKmRepair.bind(this, matrix) };
          } else {
            this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
          }
        } else if (this.headings[i] === 'Toll Count') {
          if (matrix[this.headings[i]] > 0) {
            this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.tollPaymentManagement.bind(this, matrix) };
          } else {
            this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
          }
        } else if (this.headings[i] === 'Halt') {
          if (matrix[this.headings[i]] >= 0) {
            this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.showRouteMapper.bind(this, matrix) };
          } else {
            this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
          }
        } else if(this.headings[i] == 'Share Trip'){
          this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.shareTrip.bind(this, matrix) };
        }else this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
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

  shareTrip(matrix){
    let url = matrix['Share Trip'];
    window.open(url, '_blank').focus();
  }

  openTripKmRepair(data) {
    console.log("KMdata:", data);
    if (!data['_routekm']) {
      this.common.showError('No Data');
      return;
    }
    let tripData = {
      tripId: data['_tripid'],
      vId: data['_vid']
    };
    this.common.params = tripData;
    console.log("tripData", this.common.params);

    const activeModal = this.modalService.open(TripKmRepairViewComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });
  }

  tollPaymentManagement(trip) {
    console.log("trip------", trip);
    let fromTime = trip._sdate;
    let toTime = trip._edate;
    console.log("trip------", fromTime, toTime);
    this.common.params = { vehId: trip._vid, vehRegNo: trip._regno, startDate: fromTime, endDate: toTime, startDatedis: fromTime, endDatedis: toTime,vClass: '5' };
    this.common.openType = "modal";
    this.modalService.open(TollpaymentmanagementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "mycustomModalClass" });
  }

  showRouteMapper(trip) {
    console.log('trip', trip);
    let fromTime = this.common.dateFormatter(trip._sdate);
    let toTime = this.common.dateFormatter(trip._edate);
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: trip._vid,
      vehicleRegNo: trip._regno,
      fromTime: fromTime,
      toTime: toTime,
      vehicleTripId: trip._tripid
    };
    this.modalService.open(RouteMapper, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
  }

  downloadPdf() {
    this.common.getPDFFromTableId('trip-master-report');
  }

  reportData:any = [];

  downloadExcel() {
    // this.common.getCSVFromTableId('trip-master-report');
    // this.common.getCSVFromDataArray(this.tripData, this.table.data.headings, 'trip master report')

    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name}
    ];

    this.excelService.dkgExcel('Trip Master Report', details, this.headings, this.tripData, 'Trip Master Report')
  }

}
