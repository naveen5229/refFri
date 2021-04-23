import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'placement-problem-generation',
  templateUrl: './placement-problem-generation.component.html',
  styleUrls: ['./placement-problem-generation.component.scss']
})
export class PlacementProblemGenerationComponent implements OnInit {

  placementDate = new Date();
  days=1;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal
  ) { }

  
  ngOnInit(): void {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  getDate(event) {
    this.placementDate = event;
  }



  saveplcProGeneration(){
    console.log("date:",this.placementDate);
    console.log("day:",this.days);

    this.common.loading++;
    this.api.getJavaPortDost(8084, 'generateReportForDate/' + this.common.dateFormatter1(this.placementDate)+'/'+this.days)
      .subscribe(res => {
        this.common.loading--;
        if(res['success']){
          this.common.showToast(res['msg']);
          this.activeModal.close();
        }else{
          this.common.showError(res['msg']);
        }
        // console.log("res:",res);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

}
