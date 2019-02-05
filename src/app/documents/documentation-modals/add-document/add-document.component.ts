import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
@Component({
  selector: 'add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss', '../../../pages/pages.component.css']
})
export class AddDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';

  document = {
    image: '',
    base64Image: '',
    type: {
      id: '',
      name: ''
    },
    dates: {
      issue: '',
      wef: '',
      expiry: ''
    },
    number: '',
    remark: '',
    rto: '',
    agent: {
      id: '',
      name: '',
    }
  }

  agents = [];
  docTypes = [];
  vehicle = null;
  isFormSubmit = false;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';

    this.vehicle = this.common.params.details.vehicle_info[0];
    this.agents = this.common.params.details.document_agents_info;
    this.docTypes = this.common.params.details.document_types_info;
  }

  ngOnInit() {
  }

  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    this.common.loading++;
    var binaryString = readerEvt.target.result;
    this.document.base64Image = btoa(binaryString);
    this.common.loading--;
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  addDocument() {
    const params = {
      x_vehicle_id: this.vehicle.id,
      x_document_type_id: this.document.type.id,
      x_document_type: this.findDocumentType(this.document.type.id),
      x_issue_date: this.document.dates.issue,
      x_wef_date: this.document.dates.wef,
      x_expiry_date: this.document.dates.expiry,
      x_document_agent_id: this.document.agent.id,
      x_document_number: this.document.number,
      x_base64img: 'data:image/png;base64,' + this.document.base64Image,
      x_rto: this.document.rto,
      x_remarks: this.document.remark
    };
    console.log('Params: ', params);
    this.common.loading++;
    this.api.post('Vehicles/addVehicleDocument', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("api result", res);
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.document.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.document.dates[date]);
      }

    });
  }
  findDocumentType(id) {
    let documentType = '';;
    this.docTypes.map(docType => {
      if (docType.id == id) {
        documentType = docType.document_type
      }
    });
    return documentType;
  }

  addAgent() {
    this.common.params = { title: 'Add Agent' };
    const activeModal = this.modalService.open(AddAgentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
  }

}
