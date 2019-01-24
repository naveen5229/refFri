import { Component, OnInit } from '@angular/core';
import { NbCalendarRange, NbDateService } from '@nebular/theme';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss','../../pages/pages.component.css']
})
export class DatePickerComponent implements OnInit {
  date = "";
  constructor(private activeModal: NgbActiveModal,
   public  common : CommonService) { 
    
  }
  closeModal() {
    this.date = this.common.dateFormatter1(this.date);
    this.activeModal.close({ date: this.date });
  }

  ngOnInit() {
  }

}
