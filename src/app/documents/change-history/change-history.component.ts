import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'change-history',
  templateUrl: './change-history.component.html',
  styleUrls: ['./change-history.component.scss', '../../pages/pages.component.css'],
  providers: [DatePipe]
})
export class ChangeHistoryComponent implements OnInit {
  selectedVehicle = null;
  documentTypeId = null;
  docTypes = [];
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

  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService) {

    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.searchHistory();
  }

  getvehicleData(vehicle) {
    this.selectedVehicle = vehicle.id;
    this.getDocumentsData();
  }

  getDocumentsData() {
    let response;
    this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.selectedVehicle })
      .subscribe(res => {
        this.docTypes = res['data'].document_types_info;
      }, err => {
        console.log(err);
      });
    return response;
  }

  selectDocType(docType) {
    this.documentTypeId = docType.id
  }

  searchHistory() {
    if (!this.selectedVehicle || !this.documentTypeId) {
      alert("Select All Require Field")
      return;
    }
    let params = {
      x_vehicle_id: this.selectedVehicle,
      x_document_type_id: this.documentTypeId
    };
    this.common.loading++;
    this.api.post('Vehicles/getDocumentChangeHistory', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }, err => {

        this.common.loading--;
        console.log(err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }


  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }

      // let exp_date = this.common.dateFormatter(doc.expiry_date).split(' ')[0];
      // let curr = this.common.dateFormatter(new Date()).split(' ')[0];
      // let nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');
      // console.log("expiry date:",);
      // documentId: { value: doc.DocumentID },
      // id: { value: doc.DocumentTypeID },
      // docType: { value: doc.DocumentType },
      // issueDate: { value: this.datePipe.transform(doc.IssueDate, 'dd MMM yyyy') },
      // wefDate: { value: this.datePipe.transform(doc.WefDate, 'dd MMM yyyy') },
      // expiryDate: { value: this.datePipe.transform(doc.ExpiryDate, 'dd MMM yyyy'), class: exp_date==null && curr >= exp_date ? 'red' : (exp_date==null && exp_date < nextMthDate ? 'pink' : (doc.ExpiryDate==null ? 'default' : 'green')) },
      // entryTime: { value: this.datePipe.transform(doc.EntryTime, 'dd MMM yyyy hh:mm:ss a') },
      // userId: { value: doc.UserID },
      // entryMode: { value: doc.EntryMode },
      // status: { value: doc.Status },
      columns.push(this.valobj);
    });
    return columns;
  }
}
