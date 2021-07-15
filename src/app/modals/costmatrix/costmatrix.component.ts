import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { ExcelService } from '../../services/excel/excel.service';

@Component({
  selector: 'costmatrix',
  templateUrl: './costmatrix.component.html',
  styleUrls: ['./costmatrix.component.scss']
})
export class CostmatrixComponent implements OnInit {

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

  costMatrixData=[];
  constructor(public api: ApiService,
    public common: CommonService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public user: UserService,
    private excelService: ExcelService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
      this.common.handleModalSize('class', 'modal-lg', '1300', 'px');
    //   this.costMatrixData=this.common.params.data;
    //   if(this.costMatrixData && this.costMatrixData.length>0){
    //     this.setTable();
    //   }else{this.resetTable();}
    //  } 
    this.costMatrix();
    }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close();
  }

  costMatrix(){
    let params = {
      allocType: this.common.params.allocType,
      placementDate: this.common.params.placementDate,
      quantityType: this.common.params.quantityType,
      placementProblemDetailsDTOS:this.common.params.placementProblemDetailsDTOS,
      id: this.common.params.id
    }
    this.common.loading++;
    this.api.postJavaPortDost(8084, 'getCostMatrix', params)
      .subscribe(res => {
        this.common.loading--;
        if(res && res['placementProblemCosts'] && res['placementProblemCosts'].length>0){
        console.log("res:",res['placementProblemCosts']);
        this.costMatrixData=res['placementProblemCosts'];
        this.setTable();
        }else{
          this.common.showError("No Record Found");
          this.resetTable();
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }


  generateHeadings() {

    let headings = {};
    for (var key in this.costMatrixData[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
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
    this.costMatrixData.map(matrix => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(matrix)
          };
        } else {
          column[key] = { value: matrix[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;
  }

  actionIcons(loc) {
  }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.foName;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,  'Report: '+'Cost Matrix']
    ];
    this.pdfService.jrxTablesPDF(['costMatrix'], 'costMatrix', details);
  }

  // printCSV(){
  //   let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.foName;
  //   let details = [
  //     { name: 'Name:' + name,report:"Report:Cost Matrix"}
  //   ];
  //   this.csvService.byMultiIds(['costMatrix'], 'costMatrix', details);
  // }


  printCSV() {
    // let startDate = this.common.dateFormatter1(new Date());
    // let endDate = this.common.dateFormatter1(new Date);
    // let foName = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    // let headerDetails = [];
    // headerDetails = [
    //   { sDate: startDate },
    //   { eDate: endDate },
    //   { name: foName }
    // ]
    let headersArray = ["Site Id", "Site Name", "Day Index", "Vehicle Id", "Regno",
     "Cost", "Distance", "Timex", "Time Taken","Reach Time","Start Time","End Time","Queuing Cost",
     "Waiting Cost"];
    let json = this.costMatrixData.map(costmtrx => {
      return {
        "Site Id": costmtrx['siteId'],
        "Site Name": costmtrx['siteName'],
        "Day Index": costmtrx['dayIndex'],
        "Vehicle Id": costmtrx['vehicleId'],
        "Regno": costmtrx['regno'],
        "Cost": costmtrx['cost'],
        "Distance": costmtrx['distance'],
        "Timex": costmtrx['timex'],
        "Time Taken": costmtrx['timeTaken'],
        "Reach Time": costmtrx['reachTime'],
        "Start Time": costmtrx['startTime'],
        "End Time": costmtrx['endTime'],
        "Queuing Cost": costmtrx['queuingCost'],
        "Waiting Cost": costmtrx['waitingCost'],
      };
    });
    this.excelService.jrxExcel("Cost Matrix", null, headersArray, json, 'Cost Matrix', false);
  }

}
