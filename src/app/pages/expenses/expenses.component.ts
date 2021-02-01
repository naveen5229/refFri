import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss', '../pages.component.css']

})
export class ExpensesComponent implements OnInit {
  expenses = [];
  viewImages = null;
  activeImage = 'exp_sheet1';
  viewType = 'allExp';
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnDestroy(){}
ngOnInit() {
    this.getExpenditure();
  }
  refresh() {

    this.getExpenditure();
  }
  getExpenditure() {
    ++this.common.loading;
    this.api.post('FoDetails/getExpenditureSheet', { type: this.viewType })
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res);
        this.expenses = res['data'];
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }
  getImage(expense) {
    console.log(expense);
    let images = [{
      name: "Sheet-1",
      image: expense.exp_sheets[0]
    },
      // {
      //   name: "Sheet-2",
      //   image: expense.exp_sheet2[0]
      // }
    ];
    console.log("images:", images);
    this.common.params = { images: images, title: 'LR Details' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });


  }

}

