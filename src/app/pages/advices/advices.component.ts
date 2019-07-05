import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SaveAdvicesComponent } from '../../modals/save-advices/save-advices.component';
@Component({
  selector: 'advices',
  templateUrl: './advices.component.html',
  styleUrls: ['./advices.component.scss']
})
export class AdvicesComponent implements OnInit {

  constructor(public common: CommonService,
    public modalService: NgbModal) { }

  ngOnInit() {
  }
  saveAdvices() {
    const activeModal = this.modalService.open(SaveAdvicesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
}
