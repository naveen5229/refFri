import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { StorerequisitionComponent } from '../../acounts-modals/storerequisition/storerequisition.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';


@Component({
  selector: 'storerequisitions',
  templateUrl: './storerequisitions.component.html',
  styleUrls: ['./storerequisitions.component.scss']
})
export class StorerequisitionsComponent implements OnInit {

  StockQuestions = [];
  storeRequestId = 0;
  selectedName = '';
  pending = 1;
  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public modalService: NgbModal,
    public router: Router) {
    this.common.refresh = this.refresh.bind(this);

    this.route.params.subscribe(params => {
      console.log('Params1: ', params);
      if (params.id) {
        this.storeRequestId = parseInt(params.id);
        // this.GetLedger();

        this.common.currentPage = (this.storeRequestId == -2) ? 'Store Request' : (this.storeRequestId == -3) ? 'Stock Issue' :  (this.storeRequestId == -101) ? 'Opening Stock':'Stock Transfer';
      }
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
    this.getStoreQuestion();
  }

  ngOnInit() {
  }


  refresh() {
    console.log('Refresh');
    this.getStoreQuestion();
  }

  getStoreQuestion() {
    console.log(' pending value', this.pending);
    let params = {
      foid: 123,
      storeRequestId: this.storeRequestId,
      pendingid: this.pending
    };
    this.common.loading++;
    this.api.post('Company/GetStoreReQuestion', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        let groupData = res['data'];
        this.formattData(groupData);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  openStoreRequisitions(stockQuestion?, stockQuestionBranch?) {
    this.common.params = {
      storeRequestId: this.storeRequestId,
      stockQuestionId: stockQuestion,
      stockQuestionBranchid: stockQuestionBranch,
      pendingid: this.pending
    };
    console.log('store rwequestion params',this.common.params);
    const activeModal = this.modalService.open(StorerequisitionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      console.log('responce data return',data);
      if(data.response){
      this.getStoreQuestion();
      }
    });

  }
  formattData(groupData) {
    let firstGroup = _.groupBy(groupData, 'y_id');
    console.log('groupData', firstGroup);
this.StockQuestions=[];
    for (let key in firstGroup) {
      let total = 0;

      this.StockQuestions.push(firstGroup[key])
    }
    console.log('StockQuestions', this.StockQuestions);

  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }

  changeRefresh(id) {
    if (this.pending == id) return;
    this.StockQuestions = [];
    this.getStoreQuestion();
  }
}
