import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'radio-selection',
  templateUrl: './radio-selection.component.html',
  styleUrls: ['./radio-selection.component.scss']
})
export class RadioSelectionComponent implements OnInit {
  title = '';
  buttons = {
    cancel: '',
    submit: ''
  };
  selectedOption = null;
  options = [];

  constructor(public common: CommonService,
    public activeModal: NgbActiveModal) {
    this.title = this.common.params.title || 'Select A Option';
    this.buttons = this.common.params.buttons || { cancel: 'Cancel', submit: 'Select' };
    this.options = this.common.params.options || [];
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(status) {
    console.log(status, this.selectedOption);
    if (status && this.selectedOption === null) {
      this.common.showError('Please Select An Option');
      return;
    }
    let selectedOption = null;
    if (status) {
      this.options.map(option => {
        if (option.id == this.selectedOption) selectedOption = option;
      });
    }
    this.activeModal.close({ status, selectedOption });
  }

} 
