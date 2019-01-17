import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses = [];
  viewImages = null;
  activeImage = 'exp_sheet1';
  viewType = 'allExp';
  constructor(
    public api: ApiService,
    public common: CommonService,
  ) {
    
   }

  ngOnInit() {
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
  getImage(expense){
    console.log(expense);
  let images =[{
    name: "Sheet-1",
    image : expense.exp_sheet1
  },
  {
    name: "Sheet-2",
    image : expense.exp_sheet2
  }
 ];
  console.log("images:",images);
}
  }

