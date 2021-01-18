import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FuelEntriesComponent } from '../../modals/fuel-entries/fuel-entries.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';
import { DatePipe } from '@angular/common';
import { OdoMeterComponent } from '../../modals/odo-meter/odo-meter.component';
import { start } from 'repl';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fuel-average-analysis',
  templateUrl: './fuel-average-analysis.component.html',
  styleUrls: ['./fuel-average-analysis.component.scss', '../pages.component.css'],
  providers: [DatePipe]
})
export class FuelAverageAnalysisComponent implements OnInit {

  fuelAvgDetails = [];
  showTable = false;
  Status = [
    {
      id: 1,
      name: 'ALL'
    },
    {
      id: 2,
      name: 'Issues'
    },
    {
      id: 3,
      name: 'NonIssues',
    }];
  today = new Date();
  dates = {
    start: this.common.dateFormatter(new Date(this.today.setDate(this.today.getDate() - 28))).split(' ')[0],
    end: this.common.dateFormatter(new Date()).split(' ')[0],
  };
  id = '1';
  table = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private datePipe: DatePipe, ) {

    this.getfuelAverageDetails();
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {

    this.getfuelAverageDetails();
  }
  selectType() {
    this.getfuelAverageDetails();
  }

  getfuelAverageDetails() {
    console.log("Status:", this.id);
    this.fuelAvgDetails = [];
    console.log("api hit");
    this.common.loading++;
    let params = {
      startTime: this.dates.start,
      endTime: this.dates.end,
      foId: null,
    };

    this.api.post('FuelDetails/getVehicleFuelFillingAvg', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.fuelAvgDetails = res['data'] || [];
        if (this.fuelAvgDetails != null) {
          // this.showTable = true;
          this.table = this.setTable();
        } else {
          // this.showTable = false;
          this.table = null;
          this.common.showToast('No Record Found!!');
        }
        // if (this.id == '3') {
        //   for (let i = 0; i < this.fuelAvgDetails.length; i++) {


        //     if (this.fuelAvgDetails[i].is_probable_issue == '1') {
        //       this.showTable = true;
        //       this.table = this.setTable();

        //     }
        //     //else {
        //     //   this.showTable = false;
        //     //   this.table = null;
        //     //   this.common.showToast('No Record Found!!');
        //     // }

        //   }
        // }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setTable() {
    let headings = {
      vehicleNumber: { title: 'Vehicle Number', placeholder: 'Vehicle No' },
      startDate: { title: 'Start Date', placeholder: 'Start Date', type:'date' },
      endDate: { title: 'End Date', placeholder: 'End Date' , type:'date' },
      liters: { title: 'Liters', placeholder: 'Liters' },
      amount: { title: 'Amounts', placeholder: 'Amounts' },
      average: { title: 'Average', placeholder: 'Average' },
      totalDistance: { title: 'Total Distance', placeholder: 'Total Distance' },
      loadingDistance: { title: 'Loading Distance', placeholder: 'Loading Distance' },
      unloadingDistance: { title: 'Unloading Distance', placeholder: 'Unloading Distance' },
      location: { title: 'Location Trail', placeholder: 'Location Trail' },
    };

    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }

  getTableColumns() {
    let columns = [];
    if (this.id == '1') {
      this.fuelAvgDetails.map(fuel => {
        let column = {
          vehicleNumber: { value: fuel.reg_number },
          startDate: { value: this.datePipe.transform(fuel.startdate, 'dd-MMM hh:mm a') },
          endDate: { value: fuel.enddate != null ? this.datePipe.transform(fuel.enddate, 'dd-MMM hh:mm a') : '------' },
          liters: { value: fuel.liters, class: fuel.liters ? 'blue' : 'black', action: this.getDetails.bind(this, fuel) },
          amount: { value: fuel.amounts },
          average: { value: fuel.avg },
          totalDistance: { value: fuel.total_distance, class: fuel.total_distance ? 'blue' : 'black', action: this.openRouteMapper.bind(this, fuel) },
          loadingDistance: { value: fuel.loading_distance },
          unloadingDistance: { value: fuel.unloading_distance },
          location: { value: fuel.location_trail },
          style: { background: fuel.is_probable_issue ? 'lightcoral' : '' }

        };
        columns.push(column);

      });

    }

    if (this.id == '2') {
      //this.getfuelAverageDetails();
      this.fuelAvgDetails = this.fuelAvgDetails.filter(elem => elem.is_probable_issue == 1);
      console.log("test", this.fuelAvgDetails);
      this.fuelAvgDetails.map(fuel => {
        let column = {
          vehicleNumber: { value: fuel.reg_number },
          startDate: { value: this.datePipe.transform(fuel.startdate, 'dd-MMM hh:mm a') },
          endDate: { value: fuel.enddate != null ? this.datePipe.transform(fuel.enddate, 'dd-MMM hh:mm a') : '------' },
          liters: { value: fuel.liters, class: fuel.liters ? 'blue' : 'black', action: this.getDetails.bind(this, fuel) },
          amount: { value: fuel.amounts },
          average: { value: fuel.avg },
          totalDistance: { value: fuel.total_distance, class: fuel.total_distance ? 'blue' : 'black', action: this.openRouteMapper.bind(this, fuel) },
          loadingDistance: { value: fuel.loading_distance },
          unloadingDistance: { value: fuel.unloading_distance },
          location: { value: fuel.location_trail },
          style: { background: fuel.is_probable_issue ? 'lightcoral' : '' }
        };
        columns.push(column);

      });

    }

    if (this.id == '3') {
      //this.getfuelAverageDetails();
      this.fuelAvgDetails = this.fuelAvgDetails.filter(elem => elem.is_probable_issue == null);
      console.log("test", this.fuelAvgDetails);
      this.fuelAvgDetails.map(fuel => {
        let column = {
          vehicleNumber: { value: fuel.reg_number },
          startDate: { value: this.datePipe.transform(fuel.startdate, 'dd-MMM hh:mm a') },
          endDate: { value: fuel.enddate != null ? this.datePipe.transform(fuel.enddate, 'dd-MMM hh:mm a') : '------' },
          liters: { value: fuel.liters, class: fuel.liters ? 'blue' : 'black', action: this.getDetails.bind(this, fuel) },
          amount: { value: fuel.amounts },
          average: { value: fuel.avg },
          totalDistance: { value: fuel.total_distance, class: fuel.total_distance ? 'blue' : 'black', action: this.openRouteMapper.bind(this, fuel) },
          loadingDistance: { value: fuel.loading_distance },
          unloadingDistance: { value: fuel.unloading_distance },
          location: { value: fuel.location_trail },

        };
        columns.push(column);

      });

    }

    return columns;
  }




  getDate(date) {
    this.common.params = { ref_page: 'fuel-avg' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.dates[date]);

      }

    });
  }


  getDetails(fuelAvgDetail) {
    this.common.params = fuelAvgDetail;
    console.log('Param', this.common.params);

    const activeModal = this.modalService.open(FuelEntriesComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.update) {
        this.getfuelAverageDetails();
      }
    })
  }


  openRouteMapper(fuelData) {
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    let date;
    if (fuelData.enddate != null) {
      date = fuelData.enddate
    } else {
      date = this.common.dateFormatter(new Date())
    }
    console.log('date', date);
    this.common.params = {
      vehicleId: fuelData.vehicle_id,
      vehicleRegNo: fuelData.reg_number,
      fromTime: fuelData.startdate,
      toTime: date
    };
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
    activeModal.result.then(
      data => console.log("data", data)
    );
  }


  // openOdoMeter() {
  //   let vehicleId = 56;
  //   let regno = 'Rj147678';
  //   this.common.params = { vehicleId, regno };
  //   console.log('Param', this.common.params);

  //   const activeModal = this.modalService.open(OdoMeterComponent, { size: 'lg', container: 'nb-layout' });

  // }


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
        let center_heading = "Fuel Mileage";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
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
        let center_heading = "Report:" + "Fuel Mileage";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

}
