import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss']
})
export class DiagnosticsComponent implements OnInit {
  diagnostics = {
    vechileno: null,
    startTime: this.common.dateFormatter(new Date()),
    endTime:this.common.dateFormatter(new Date())

  }

  constructor(
    private modalservice: NgbModal,
    public common: CommonService,
  ) { }

  ngOnInit() {
  }
  getDate(time) {
    const activeModal = this.modalservice.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.diagnostics[time] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.diagnostics[time]);
    });


  }
}
