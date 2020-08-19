import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { EditFillingComponent } from '../../../app/modals/edit-filling/edit-filling.component';
import { ImportFillingsComponent } from '../../../app/modals/import-fillings/import-fillings.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FuelStationEntryComponent } from '../../modals/fuel-station-entry/fuel-station-entry.component';
import { ShowFuelStationComponent } from '../../modals/show-fuel-station/show-fuel-station.component';
import { TankEmptyDetailsComponent } from '../../modals/tank-empty-details/tank-empty-details.component';
import { CsvService } from '../../services/csv/csv.service';
@Component({
  selector: 'fuel-fillings',
  templateUrl: './fuel-fillings.component.html',
  styleUrls: ['./fuel-fillings.component.scss', '../../pages/pages.component.css']
})
export class FuelFillingsComponent implements OnInit {
  fillingData = [];

  headings = [];
  table = {
    data: {
      headings: {
        // id: { title: 'ID', placeholder: 'ID' },
        pump: { title: 'Pump', placeholder: 'Pump' },
        date: { title: 'Date', placeholder: 'Date' },
        regno: { title: 'Regno', placeholder: 'Regno' },
        litres: { title: 'Litres', placeholder: 'Litres' },
        rate: { title: 'Rate', placeholder: 'Rate' },
        amount: { title: 'Amount', placeholder: 'Amount' },
        addtime: { title: 'Addtime', placeholder: 'Addtime' },
        username: { title: 'Username', placeholder: 'Username' },
        refName: { title: 'RefName', placeholder: 'RefName' },
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  sizeIndex=0;
  dates = {
    start: this.common.dateFormatter(new Date()),
    end: this.common.dateFormatter(new Date())
  };


  constructor(public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private csvService: CsvService) {
    let today;
    today = new Date();
    this.dates.end = (this.common.dateFormatter(today)).split(' ')[0];
    this.dates.start = (this.common.dateFormatter(new Date(today.getFullYear(), today.getMonth(), 1))).split(' ')[0];
    this.getFillingData();
    this.common.refresh = this.refresh.bind(this);
    console.log("Page Type:", user._pages);
  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getFillingData();

  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getFillingData() {
    const params = {
      startTime: this.dates.start,
      endTime: this.dates.end + ' ' + '23:59:59',
    }

    this.common.loading++;
    let user_id = this.user._details.id;
    if (this.user._loggedInBy == 'admin')
      user_id = this.user._customer.id;
    this.fillingData = [];
    this.api.post('FuelDetails/getFuelFillingEntries', params)
      .subscribe(res => {
        this.common.loading--;
        this.fillingData = res['data'] || [];
        console.info("filling Data", this.fillingData);

        console.log(this.table.data.headings);
        this.table.data.columns = this.getTableColumns();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }




  openData(rowfilling) {
    this.common.params = { rowfilling, title: 'Edit Fuel Filling' };
    const activeModal = this.modalService.open(EditFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getFillingData();
        // window.location.reload();

      }
    });
  }

  addFuel() {
    let rowfilling = {
      fdate: null,
      litres: null,
      is_full: null,
      regno: null,
      rate: null,
      amount: null,
      pp: null,
      fuel_station_id: null,
      vehicle_id: null,
      id: null,
      ref_type: null,
      ref_id: null,
    };
    this.common.params = { rowfilling, title: 'Add Fuel Filling',sizeIndex:this.sizeIndex };
    const activeModal = this.modalService.open(EditFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getFillingData();
        // window.location.reload();

      }
    });
  }

  addCsv() {
    const activeModal = this.modalService.open(ImportFillingsComponent, { container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // if (data.response) {
      //   window.location.reload();
      // }
    });
  }

  getTableColumns() {
    let columns = [];

    this.fillingData.map(frec => {
      //valobj[this.headings[i]] = { value: val, class: (val > 0 )? 'blue': 'black', action: val >0 ? this.openData.bind(this, docobj, status) : '' };
      let column = {
        //  id: { value: frec.id, class: 'blue', action: this.openData.bind(this, frec) },
        pump: { value: frec.pp, class: 'blue', action: this.user.permission.edit && this.openData.bind(this, frec) },
        date: { value: this.datePipe.transform(frec.date, 'dd MMM yyyy'), class: 'blue', action: this.openFuelEntry.bind(this, frec) },
        regno: { value: frec.regno },
        litres: { value: frec.litres },
        rate: { value: frec.rate },
        amount: { value: frec.amount },
        addtime: { value: this.datePipe.transform(frec.addtime, 'dd MMM yyyy') },
        username: { value: frec.username },
        refName: { value: frec.refnum },
        rowActions: {}
      };

      columns.push(column);
    });

    return columns;
  }


  getDate(date) {
    this.common.params = { ref_page: 'fuel-avg' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.dates[date]);
        if (this.dates.start && this.dates.end)
          this.getFillingData();
      }

    });
  }

  openFuelEntry(val) {

    this.common.params = {
      vid: val.vehicle_id,
      datetime: this.common.dateFormatter(val.date).split(' ')[0]
    };
    this.modalService.open(FuelStationEntryComponent, { size: 'lg', container: 'nb-layout' });
  }

  getFuelStation() {

    this.modalService.open(ShowFuelStationComponent, { size: 'lg', container: 'nb-layout' });
    this.common.handleModalSize('class', 'modal-lg', '1200');

  }

  getFuelMapping() {
    this.common.loading++;
    this.api.get('Fuel/mappingFillingStationEntries?')
      .subscribe(res => {
        this.common.loading--;
        console.log('Mapping:', res['data']);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getisFuel() {
    this.common.loading++;
    this.api.get('Fuel/mappingIsFullFilling?')
      .subscribe(res => {
        this.common.loading--;
        console.log('Mapping:', res['data']);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getemptyFueldetails() {
    this.modalService.open(TankEmptyDetailsComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
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
        let center_heading = "Fuel Filling";
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
        // let left_heading = "FoName:" + fodata['name'];
        // let center_heading = "Report:" + "Fuel Filling";
        // this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
        let details = [
          { customer: 'Customer : ' + fodata['name'] },
          { report: 'Report : Fuel Filling' }
          // { time: 'Time : ' + this.datePipe.transform(this.today, 'dd-MM-yyyy hh:mm:ss a') }
        ];
        this.csvService.byMultiIds([tblEltId], 'Dashboard', details);
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }
}
