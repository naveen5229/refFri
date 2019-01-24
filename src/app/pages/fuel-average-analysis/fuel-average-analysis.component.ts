import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'fuel-average-analysis',
  templateUrl: './fuel-average-analysis.component.html',
  styleUrls: ['./fuel-average-analysis.component.scss','../pages.component.css']
})
export class FuelAverageAnalysisComponent implements OnInit {

  fuelAvgDetails = [];
  startTime = '';
  endTime = '';
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
      this.getfuelAverageDetails();

  }

  ngOnInit() {
  }

  getfuelAverageDetails()
  {
    this.common.loading++;
    let params = {
      startTime: this.startTime,
      endTime: this.endTime,
      foId: null,
    };
    this.api.post('FuelDetails/getFillingsByDateAndFoid',params)
    .subscribe(res => {
      this.common.loading--;
      console.log(res);
      this.fuelAvgDetails = res['data'];
    }, err => {
      this.common.loading--;
      console.log(err);
    });
  }
  getTime(time){
    console.log(time);
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'lg', container: 'nb-layout' });

  }
}
