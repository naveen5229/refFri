import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
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
  table = null;

  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {

    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.searchHistory();
  }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.selectedVehicle = vehicle.id;
    this.getDocumentsData();

  }


  getDocumentsData() {
    // this.common.loading++;
    let response;
    this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.selectedVehicle })
      .subscribe(res => {
        // this.common.loading--;
        // console.log("data", res);
        // this.vehicle = res['data'].vehicle_info[0];
        // this.agents = res['data'].document_agents_info;
        this.docTypes = res['data'].document_types_info;
        console.log("data type ",this.docTypes);
      }, err => {
        // this.common.loading--;
        console.log(err);
      });
    return response;
  }

  selectDocType(docType) {
    console.log("api result", docType);
    this.documentTypeId = docType.id
    console.log("doc var", this.documentTypeId);
  }
  searchHistory() {
    if(!this.selectedVehicle || !this.documentTypeId){
      alert("Select All Require Field")
      return;
    }
    let params = {
      x_vehicle_id: this.selectedVehicle,
      x_document_type_id: this.documentTypeId
    };
    this.common.loading++;
    this.api.post('Vehicles/getDocumentChangeHistory', { x_vehicle_id: this.selectedVehicle, x_document_type_id: this.documentTypeId })
      .subscribe(res => {
        this.common.loading--;     
        this.data = res['data'];
        if(this.data.length<1)
        {
          alert("not result Available");
        }
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setTable() {
    let headings = {
      documentId: { title: 'Document Id', placeholder: 'Doc Id' },
      id: { title:'DocTypeId', placeholder:'DocTypeId'},
      docType: { title: 'Document Type', placeholder: 'Document Type' },
      issueDate: { title: 'Issue Date', placeholder: 'IssueDate' },
      wefDate: { title: 'Wef Date', placeholder: 'WefDate' },
      expiryDate: { title: 'Expiry Date', placeholder: 'ExpiryDate' },
      entryTime: { title: 'Entry Time', placeholder: 'EnrtyTime' },
      userId: { title: 'User Id', placeholder: 'User Id' },
      entryMode: { title: 'Entry Mode', placeholder: 'Entry Mode' },
      status: { title: 'Status', placeholder: 'Status' },
      
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.data.map(doc => {

      let exp_date = this.common.dateFormatter(doc.expiry_date).split(' ')[0];
      let curr = this.common.dateFormatter(new Date()).split(' ')[0];
      let nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');
      console.log("expiry date:", exp_date);
      let column = {
        documentId: { value: doc.DocumentID },
        id: { value: doc.DocumentTypeID },
        docType: { value: doc.DocumentType },
        issueDate: { value: this.datePipe.transform(doc.IssueDate, 'dd MMM yyyy') },
        wefDate: { value: this.datePipe.transform(doc.WefDate, 'dd MMM yyyy') },
        expiryDate: { value: this.datePipe.transform(doc.ExpiryDate, 'dd MMM yyyy'), class: exp_date==null && curr >= exp_date ? 'red' : (exp_date==null && exp_date < nextMthDate ? 'pink' : (doc.ExpiryDate==null ? 'default' : 'green')) },
        entryTime: { value: this.datePipe.transform(doc.EntryTime, 'dd MMM yyyy hh:mm:ss a') },
        userId: { value: doc.UserID },
        entryMode: { value: doc.EntryMode },
        status: { value: doc.Status },
       
      };
      
      columns.push(column);
    });
    return columns;
  }

}
