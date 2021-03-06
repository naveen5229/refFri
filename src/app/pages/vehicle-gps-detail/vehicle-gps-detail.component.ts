import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-gps-detail',
  templateUrl: './vehicle-gps-detail.component.html',
  styleUrls: ['./vehicle-gps-detail.component.scss'],
  providers: [DatePipe]
})
export class VehicleGpsDetailComponent implements OnInit {

  gpsDtails = [];
  foid;
  table = {
    data: {
      headings: null,
      columns: []
    },
    settings: {
      hideHeader: true, tableHeight: '75vh'
    }
  };
  constructor(public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    public modalService: NgbModal) {
    this.getVehicleGpsDetail();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy() { }
  ngOnInit() {
  }
  refresh() {
    this.getVehicleGpsDetail();
  }



  getVehicleGpsDetail() {
    this.common.loading++;
    this.api.get('GpsData/getVehicleGpsDetail')
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.gpsDtails = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      regno: { title: 'Vehicle Reg No.', placeholder: 'Vehicle regno' },
      apiProvider: { title: 'API Details', placeholder: 'API Details' },
      lastCall: { title: 'Last Call ', placeholder: 'Last Call' },
      time: { title: 'Date Time ', placeholder: 'Date Time ' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true, tableHeight: '75vh'
      }

    }
  }

  getTableColumns() {
    let columns = [];
    this.gpsDtails.map(doc => {
      let apiProvider = doc.apiprovider ? (doc.apiprovider.charAt(0).toUpperCase() + doc.apiprovider.slice(1)) : '';
      console.log('apiProvider', apiProvider);
      let column = {
        regno: { value: doc.regno },
        apiProvider: { value: apiProvider },
        lastCall: { value: doc.lastcalldt }, //{ value: this.datePipe.transform(doc.lastcalldt, 'dd MMM HH:mm') },
        time: { value: doc.dttime }//{ value: this.datePipe.transform(doc.dttime, 'dd MMM HH:mm') },

      };
      columns.push(column);
    });
    return columns;
  }


  // printPDF(tblEltId) {
  //   this.common.loading++;
  //   let userid = this.user._customer.id;
  //   if (this.user._loggedInBy == "customer")
  //     userid = this.user._details.id;
  //   this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       let fodata = res['data'];
  //       let left_heading = fodata['name'];
  //       let center_heading = "GPS Details";
  //       this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"],'');
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }

  // printCsv(tblEltId) {
  //   this.common.loading++;
  //   let userid = this.user._customer.id;
  //   if (this.user._loggedInBy == "customer")
  //     userid = this.user._details.id;
  //   this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       let fodata = res['data'];
  //       let left_heading = "FoName:" + fodata['name'];
  //       let center_heading = "Report:" + "GPS Details";
  //       this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"],'');
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });


  // }

  printPDF() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:", name);
    let details = [
      ['Name: ' + name, 'Report: ' + 'Vehicle-GPS-Details']
    ];
    this.pdfService.jrxTablesPDF(['gpsDetails'], 'gps-Details', details);
  }

  printCsv() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name, report: "Report:Vehicle-GPS-Details" }
    ];
    this.csvService.byMultiIds(['gpsDetails'], 'gps-Details', details);
  }




}
