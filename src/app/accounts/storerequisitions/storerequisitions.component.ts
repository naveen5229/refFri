import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { StorerequisitionComponent } from '../../acounts-modals/storerequisition/storerequisition.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'storerequisitions',
  templateUrl: './storerequisitions.component.html',
  styleUrls: ['./storerequisitions.component.scss']
})
export class StorerequisitionsComponent implements OnInit {

  StockQuestions = [];
  storeRequestId=0;
  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public modalService: NgbModal,
    public router: Router) {
    this.common.currentPage = 'Store Request';
    this.route.params.subscribe(params => {
      console.log('Params1: ', params);
      if (params.id) {
        this.storeRequestId = parseInt(params.id);
       // this.GetLedger();
      }
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
    this.getStoreQuestion();
  }

  ngOnInit() {
  }

  getStoreQuestion(){
    let params = {
      foid: 123
    };
    this.common.loading++;
    this.api.post('Company/GetStoreReQuestion', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockQuestions = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  openStoreRequisitions(stockQuestion?,stockQuestionBranch?) {
    this.common.params = {
      storeRequestId : this.storeRequestId,
      stockQuestionId : stockQuestion,
      stockQuestionBranchid:stockQuestionBranch
    };
    const activeModal = this.modalService.open(StorerequisitionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
    });
  }
}
