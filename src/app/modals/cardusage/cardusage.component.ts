import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IssueReportComponent } from '../issue-report/issue-report.component';

@Component({
  selector: 'cardusage',
  templateUrl: './cardusage.component.html',
  styleUrls: ['./cardusage.component.scss']
})
export class CardusageComponent implements OnInit {


  cardUsage = [];
  total = 0;

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
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal,
    public modalService: NgbModal,
  ) { 
    console.log("------------",this.common.params);
    this.getcardUsage();
  }

  ngOnInit() {
  }



  getcardUsage() {

    let params = "vehid=" + this.common.params.vehicleid + "&startdate=" + this.common.params.startdate + "&enddate=" + this.common.params.enddate;
    this.common.loading++;
    let response;
    this.api.walle8Get('AccountSummaryApi/ViewSingleVehicleReport.json?' + params)
    .subscribe(res => {
      this.common.loading--;
      this.cardUsage = res['data'];
      console.log("-----+++++------",this.cardUsage);
      }, err => {
        this.common.loading--;
        console.log(err);
      });


    // let params = "vehid=" + this.common.params.vehicleid + "&startdate=" + this.common.params.startdate + "&enddate=" + this.common.params.enddate;
    // console.log("-----------",params);
    // this.common.loading++;
    // let response;
    // this.api.walle8Get('AccountSummaryApi/ViewSingleVehicleReport.json?' + params)
    // .subscribe(res => {
    //   this.common.loading--;
    //   console.log('res: ' + res['data']);
    //   this.cardUsage = res['data'];
    //   let first_rec = this.cardUsage;
    //   let headings = {};
    //   for (var key in first_rec) {
    //     if (key.charAt(0) != "_") {
    //       this.headings.push(key);
    //       let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
    //       headings[key] = headerObj;
    //     }
    //   }
    //   this.table.data = {
    //     headings: headings,
    //     columns: this.getTableColumns()
    //   };
    // }, err => {
    //     this.common.loading--;
    //     console.log(err);
    //   });
    // return response;

  }

  // getTableColumns() {
  //   let columns = [];
  //   console.log("Data=", this.cardUsage);
  //   this.cardUsage.map(matrix => {
  //     this.valobj = {};
  //     for (let i = 0; i < this.headings.length; i++) {
  //         this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
  //     }
  //     columns.push(this.valobj);
  //   });
  //   return columns;

  //   console.log("-----+++++-----",columns);
  // }

  // formatTitle(title) {
  //   return title.charAt(0).toUpperCase() + title.slice(1)
  // }

closeModal(){
this.activeModal.close();
}


openImageUploadModal(cardDetail)
{
  let cardUsage = {
    id : cardDetail.id,
    vehId : this.common.params.vehicleid
  }
  this.common.params = {cardUsage:cardUsage}
  const activeModal = this.modalService.open(IssueReportComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static'});
  activeModal.result.then(data => {
  });
}

}
