import { Component, OnInit } from '@angular/core';
import { TripKmRepairViewComponent } from '../../modals/trip-km-repair-view/trip-km-repair-view.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TollpaymentmanagementComponent } from '../../modals/tollpaymentmanagement/tollpaymentmanagement.component';
import { RouteMapper } from '../../modals';



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
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  startTime = new Date();
  endTime = new Date();

  constructor(public api: ApiService,
    public common: CommonService,
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
        if(this.headings[i] === 'AI Repaired Distance'){
          this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.aiRepairedDistanceAction.bind(this, matrix) };
        } else if(this.headings[i] === 'Toll Count'){
          this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.tollCountAction.bind(this, matrix) };
        }  else if(this.headings[i] === 'Halt'){
          this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.aiRepairedDistanceAction.bind(this, matrix) };
        } else this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  aiRepairedDistanceAction(data){
    console.log("aiRepairedDistanceAction data :" , data);
  }

  tollCountAction(data){
    console.log("aiRepairedDistanceAction data :" , data);
  }

  haltAction(data){
    console.log("aiRepairedDistanceAction data :" , data);
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }





  // getTripMasterReport() {
  //   this.tripData = [];
  //   const params = "vid=" + this.selectedVehicle.id + "&startTime=" + this.common.dateFormatter(this.startTime) +
  //     "&endTime=" + this.common.dateFormatter(this.endTime);
  //   this.common.loading++;
  //   this.api.get('TripsOperation/getTripMasterReport?' + params)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       if (res['code'] > 0) {
  //         this.tripMasterReportData = res['data'] ? res['data'] : [];
  //         this.tripData = this.tripMasterReportData.map(item => {
  //           item.origin = item['trp_points'][0];
  //           let last = item['trp_points'].length - 1;
  //           item.via = item['trp_points'].length > 2 ? item['trp_points'][1] : '';
  //           item.destination = item['trp_points'].length >= 2 ? item['trp_points'][last] : '';

  //           console.log("origin:", item.origin);
  //           console.log("via:", item.via);
  //           console.log("destination:", item.destination);

  //           // item['trp_points'][1]='Via';
  //           // item['trp_points'][last]='Destination';
  //           return item;
  //         })

  //         this.createSmartTableData();

  //         console.log("tripData:", this.tripData);


  //         console.log("data:", this.tripMasterReportData);
  //       } else {
  //         this.common.showError(res['msg']);
  //       }
  //     }, err => {
  //       this.common.loading--;
  //       this.common.showError();
  //     })
  // }

  openTripKmRepair(data) {
    console.log("KMdata:", data);
    if (!data['route_kms']) {
      this.common.showError('No Data');
      return;
    }
    let tripData = {
      tripId: data['trip_id'],
      vId: data['vid']
    };
    this.common.params = tripData;
    console.log("tripData", this.common.params);

    const activeModal = this.modalService.open(TripKmRepairViewComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      // this.getVehicleTrips();
    });
  }

  tollPaymentManagement(trip) {
    console.log("trip------", trip);
    let fromTime = trip._startdate;
    let toTime = trip._enddate;
    console.log("trip------", fromTime, toTime);
    this.common.params = { vehId: trip.vid, vehRegNo: trip.regno, startDate: trip['origin']['act_start_time'], endDate: trip['destination']['act_end_time'], startDatedis: trip['origin']['act_start_time'], endDatedis: trip['destination']['act_end_time'] };
    this.common.openType = "modal";
    // this.common.handleModalHeightWidth('class', 'modal-lg', '200', '1500');
    this.modalService.open(TollpaymentmanagementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "mycustomModalClass" });
  }

  showRouteMapper(trip) {
    console.log('trip', trip);
    let fromTime = this.common.dateFormatter(trip.start_time);
    let toTime = this.common.dateFormatter(trip.end_time);
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: trip.vid,
      vehicleRegNo: trip.regno,
      fromTime: fromTime,
      toTime: toTime
    };
    this.modalService.open(RouteMapper, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
  }

  // createSmartTableData() {
  //   let headings = {
  //     trip_id: { placeholder: 'Trip Id' },
  //     regno: { placeholder: 'Vehicle No.' },
  //     trip_onward_status: { placeholder: 'Onward Status' },
  //     inv_start_time: { placeholder: 'Invoice Date & Time' },
  //     receipt_no: { placeholder: 'LR No.' },
  //     product_name: { placeholder: 'Product Name' },
  //     route_name: { placeholder: 'Route Name' },
  //     lead_dis: { placeholder: 'Lead Distance' },
  //     gps_dis: { placeholder: 'GPS Distance' },
  //     route_kms: { placeholder: 'AI Repaired Distance' },
  //     lead_dis_deviation: { placeholder: 'Lead Distance Deviation' },
  //     dest_deviation: { placeholder: 'Destination Deviation' },
  //     cnee: { placeholder: 'Consignee' },
  //     cnor: { placeholder: 'Consignor' },
  //     mode: { placeholder: 'Mode' },
  //     gps_per: { placeholder: 'GPS %' },
  //     sim_per: { placeholder: 'SIM %' },
  //     org_loc_name: { placeholder: 'Org Location' },
  //     org_trans_time: { placeholder: 'Org Reporting Time' },
  //     org_act_start_time: { placeholder: 'Org Entry Time' },
  //     org_act_end_time: { placeholder: 'Org Exit Time' },
  //     org_load_time: { placeholder: 'Org Detention' },
  //     org_delay: { placeholder: 'Org Delay' },
  //     via_loc_name: { placeholder: 'Via Location' },
  //     via_trans_time: { placeholder: 'Via Reporting Time' },
  //     via_act_start_time: { placeholder: 'Via Entry Time' },
  //     via_act_end_time: { placeholder: 'Via Exit Time' },
  //     via_dest_name: { placeholder: 'Via Detention' },
  //     via_delay: { placeholder: 'Via Delay' },
  //     dest_loc_name: { placeholder: 'Dest Location' },
  //     dest_trans_time: { placeholder: 'Dest Reporting Time' },
  //     dest_act_start_time: { placeholder: 'Dest Entry Time' },
  //     dest_act_end_time: { placeholder: 'Dest Exit Time' },
  //     unload_time: { placeholder: 'Dest Detention' },
  //     dest_delay: { placeholder: 'Dest Delay' },
  //     trip_time: { placeholder: 'Total Trip Time' },
  //     trip_delay: { placeholder: 'Total Trip Delay' },
  //     weight: { placeholder: 'Weight' },
  //     toll_count: { placeholder: 'Toll Count' },
  //     stoppagecount: { placeholder: 'Halt' },
  //     driver_name: { placeholder: 'Driver Name' },
  //     driver_mobile: { placeholder: 'Driver Mobile' },
  //     expire_veh_count: { placeholder: 'Expired Doc. Count' },
  //     challan_amount: { placeholder: 'Challan date/Amount' },
  //     trip_stamp_status: { placeholder: 'Stamp Status' }
  //   }
  //   let rows = this.tripData.map(trip => {
  //     let row = {};
  //     Object.keys(headings)
  //       .map(heading => {
  //         let value = trip[heading];
  //         if (heading.startsWith('org_')) {
  //           value = trip.origin[heading.replace('org_', '')];
  //           if (heading.endsWith('load_time')) {
  //             value = trip.load_time;
  //           }
  //         } else if (heading.startsWith('via_')) {
  //           value = trip.via[heading.replace('org_', '')];
  //         } else if (heading.startsWith('dest_')) {
  //           value = trip.destination[heading.replace('dest_', '')];
  //           if (heading.endsWith('unload_time')) {
  //             value = trip.unload_time;
  //           }
  //         }
  //         let action = null;
  //         let className = null;
  //         if (heading == 'route_kms') {
  //           action = this.openTripKmRepair.bind(this, trip);
  //           className = 'blue';
  //         } else if (heading == 'toll_count') {
  //           action = this.tollPaymentManagement.bind(this, trip);
  //           className = 'blue';
  //         } else if (heading == 'stoppagecount') {
  //           action = this.showRouteMapper.bind(this, trip);
  //           className = 'blue';
  //         }
  //         row[heading] = { value, action, class: className }
  //       });
  //     return row;
  //   });
  //   this.table.data = {
  //     headings,
  //     columns: rows
  //   }
  // }

  downloadPdf() {
    this.common.getPDFFromTableId('trip-master-report');
  }

  downloadExcel() {
    this.common.getCSVFromTableId('trip-master-report');
  }

}
