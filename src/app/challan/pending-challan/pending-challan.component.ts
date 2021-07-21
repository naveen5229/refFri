import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { PdfViewerComponent } from '../../generic/pdf-viewer/pdf-viewer.component';
import { ChallanPendingRequestComponent } from '../../modals/challanModals/challan-pending-request/challan-pending-request.component';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { UserService } from '../../services/user.service';
import { ExcelService } from '../../services/excel/excel.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'pending-challan',
  templateUrl: './pending-challan.component.html',
  styleUrls: ['./pending-challan.component.scss']
})
export class PendingChallanComponent implements OnInit {
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 30));
  challanStatus = '-1';
  challan = [];
  paidAmount = '';
  pendingAmount = '';
  totalAmount = '';
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  pdfUrl = '';
  newChallanList: any = [];
  changedData: boolean = false;
  newChallan:any = [];

  constructor(public common: CommonService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public user: UserService,
    public api: ApiService,
    private excelService: ExcelService,
    private modalService: NgbModal,) {

  }

  ngOnDestroy() { }
  ngOnInit() {
  }


  getPendingChallans() {
    this.challan = [];
    if (!this.startDate && !this.endDate) {
      this.common.showError("Please Enter StartDate and EndDate");
    } else if (!this.startDate) {
      this.common.showError("Please Enter StartDate");
    } else if (!this.endDate) {
      this.common.showError("Please Enter EndDate");
    } else if (this.startDate > this.endDate) {
      this.common.showError("StartDate Should be less Then EndDate")
    } else {
      let params = "fromTime=" + this.common.dateFormatter(this.startDate) + "&toTime=" + this.common.dateFormatter(this.endDate) + "&viewType=" + this.challanStatus + "&appType=" + 'dashboard';
      this.common.loading++;
      this.api.get('RcDetails/getPendingChallans?' + params)
        .subscribe(res => {
          console.log('Res:', res);
          this.common.loading--;
          this.clearAllTableData();
          if (!res['data']) {
            this.common.showError("Data Not Found");
            return;
          }
          this.newChallan = res['data'];
          
          this.getData(res['data'], true);
        },
          err => {
            this.common.loading--;
            this.common.showError(err);
          });
    }

  }

  getData(res, status) {
    console.log('res is: ', res);
    
    this.challan = res;
    console.log("ChallanData:", this.challan);
    if (status == true) {
      const pending = this.challan.filter(item => item['Payment Type'] === 'Pending')
        .reduce((pending, current) => pending + current.Amount, 0);
      var pen = Number(pending).toLocaleString('en-GB')
      this.pendingAmount = pen;


      const cash = this.challan.filter(item => item['Payment Type'] === 'Cash')
        .reduce((cash, current) => cash + current.Amount, 0);
      var cashamt = Number(cash).toLocaleString('en-GB')
      this.paidAmount = cashamt;

      const total = pending + cash;
      var totl = Number(total).toLocaleString('en-GB');
      this.totalAmount = totl;
    }

    this.setTable();
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.challan[0]),
      columns: this.getColumns(this.challan, this.challan[0])
    };
  }

  generateHeadings(keyObject) {
    let headings = {};
    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        if (key === 'Challan Date') {
          headings[key]['type'] = 'date';
        }
      }
    }
    return headings;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getColumns(challanList, chHeadings) {
    let columns = [];
    challanList.map(item => {
      let column = {};
      for (let key in this.generateHeadings(chHeadings)) {
        if (key == "Action") {
          column[key] = {
            value: "", action: null, icons: [
              { class: item._ch_doc_id ? 'far fa-file-alt' : 'far fa-file-alt text-color', action: this.paymentDocImage.bind(this, item._ch_doc_id) },
              { class: item._payment_doc_id ? 'far fa-file-pdf' : 'far far fa-file-pdf text-color', action: this.paymentDocImage.bind(this, item['_payment_doc_id1'] ? item['_payment_doc_id1'] : item['_payment_doc_id']) },
              { class: item['Payment Type'] == 'Pending' && item._ch_doc_id && item._req_status == 0 && (!(item._payment_doc_id)) && (!(item.State.includes('PB') || item.State.includes('BR') || item.State.includes('UK'))) ? 'far fa-money-bill-alt' : '', action: this.challanPendingRequest.bind(this, item) },
              { class: this.classList(item), action: '' }

            ]
          };
        } else if (key == "Challan Date") {
          column[key] = { value: item[key], class: 'black', action: '' };
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  classList(item) {
    if (item['Payment Type'] == 'Pending' && (item.State.includes('PB') || item.State.includes('BR') || item.State.includes('UK'))) {
      return 'fas fa-times-circle'
    } else {
      if (item['_req_status'] == 1 && item['_payment_doc_id'] == null) {
        return 'fas fa-hourglass-end'
      } else if (item['_req_status'] == 3 && item['_payment_doc_id']) {
        return 'fas fa-check'
      } else if (item['_req_status'] == -1 && item['_payment_doc_id'] == null) {
        return 'fas fa-backspace'
      }
    }
  }

  filterRows(value) {
    this.newChallanList = [];
    console.log('value is: ', value);
    this.newChallan.forEach(item => {
      if(value == 1){
        if (item['Payment Type'] == 'Pending' && (item.State.includes('PB') || item.State.includes('BR') || item.State.includes('UK'))){
          this.newChallanList.push(item);
        }
      } else if(value == 2){
        if(item['Payment Type'] == 'Pending' && item._ch_doc_id && item._req_status == 0 && (!(item._payment_doc_id)) && (!(item.State.includes('PB') || item.State.includes('BR') || item.State.includes('UK')))){
          this.newChallanList.push(item);
        }

      } else if(value == 3){
        if (item['_req_status'] == 1 && item['_payment_doc_id'] == null) {
          this.newChallanList.push(item);
        }
      }else if(value == 4){
        if(item['_req_status'] == 3 && item['_payment_doc_id']){
          this.newChallanList.push(item);
        }
      } else if(value == 5){
        if(item['_req_status'] == -1 && item['_payment_doc_id'] == null){
        }
      } else if(value == 6){
        this.newChallanList.push(item);
      }
    })
    this.getData(this.newChallanList, false);
  }


  showAllRecords(event) {
    console.log('show all event is: ', event)
  }

  challanPendingRequest(challan) {
    this.common.params = {
      regNo: challan.Regno,
      chDate: challan['Challan Date'],
      chNo: challan['Challan No'],
      amount: challan.Amount,
      rowId: challan._id,
      vehId: challan._vid,
      foid: challan._foid,
    }
    const activeModal = this.modalService.open(ChallanPendingRequestComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getPendingChallans();
      }
    });

  }

  paymentDocImage(paymentId) {
    if (paymentId) {
      this.pdfUrl = '';
      let params = "docId=" + paymentId;
      this.common.loading++;
      this.api.get('Documents/getRepositoryImages?' + params)
        .subscribe(res => {
          this.common.loading--;
          console.log(res['data']);
          if (res['data']) {
            this.pdfUrl = res['data'][0]['url'];
            this.common.params = { pdfUrl: this.pdfUrl, title: "Challan" };
            console.log("params", this.common.params);
            this.modalService.open(PdfViewerComponent, {
              size: "lg",
              container: "nb-layout"
            });
          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  clearAllTableData() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }


  lastchecked() {
    let dataparams = {
      view: {
        api: 'Challans/getPendingLastCheckedReport',
        param: {}
      },

      title: 'Last Checked Report '
    }
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  printPDF() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:", name);
    let details = [
      ['Name: ' + name, 'Start Date: ' + this.common.dateFormatter1(this.startDate), 'End Date: ' + this.common.dateFormatter1(this.endDate), 'Report: ' + 'Challan']
    ];
    this.pdfService.jrxTablesPDF(['pendingChallan'], 'challan', details);
  }

  // printCSV(tblEltId){
  //   let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
  //   let details = [
  //     { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter1(this.startDate),enddate:'End Date:'+this.common.dateFormatter1(this.endDate), report:"Report:Challan"}
  //   ];
  //   this.csvService.byMultiIds(['pendingChallan'], 'challan', details);
  //   this.common.getCSVFromTableId(tblEltId, details, '', '', '');
  // }

  generateExcel() {

    let startDate = this.common.dateFormatter1(this.startDate);
    let endDate = this.common.dateFormatter1(this.endDate);
    let foName = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    let headerDetails = [];
    headerDetails = [
      { sDate: startDate },
      { eDate: endDate },
      { name: foName }
    ]
    let headersArray = ["RegNo", "Challan Date", "Challan No", "Dl Rc No", "Payment", "Payment Source", "State", "Payment Type", "Amount", "Transaction Id", "Violator Name", "Driver"];
    let json = this.challan.map(challan => {
      return {
        "RegNo": challan['Regno'],
        "Challan Date": challan['Challan Date'],
        "Challan No": challan['Challan No'],
        "Dl Rc No": challan['Dl Rc No'],
        "Payment": challan['Payment'],
        "Payment Source": challan['Payment Source'],
        "State": challan['State'],
        "Payment Type": challan['Payment Type'],
        "Amount": challan['Amount'],
        "Transaction Id": challan['Transaction Id'],
        "Violator Name": challan['Violator Name'],
        "Driver": challan['Driver'],
      };
    });

    this.excelService.jrxExcel("Pending Challan", headerDetails, headersArray, json, 'Pending Challan', false);
  }

}
