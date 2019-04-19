import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'openingstock',
  templateUrl: './openingstock.component.html',
  styleUrls: ['./openingstock.component.scss']
})
export class OpeningstockComponent implements OnInit {
  openingStocks = [];
  stockdata=[];
  selectedRow = -1;
  selectedName = '';
  openingstock = {
    date: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-')


  };
  activeId = 'date';

  allowBackspace = true;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService) {
    this.common.currentPage = 'Opening Stock';
    this.setFoucus('date');
  }

  ngOnInit() {
  }
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);

    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('date')) {
        this.openingstock.date = this.common.handleDateOnEnterNew(this.openingstock.date);
        this.setFoucus('submit');
      }

    }
    else if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.openingStocks.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.openingStocks.length - 1) this.selectedRow++;
  
    }
  }
  setFoucus(id, isSetLastActive = true) {
    console.log('Id: ', id);
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();

    }, 100);
  }
  dismiss(response) {

    if (response) {

      this.getOpeningStock(this.openingstock);
    }
    // this.activeModal.close({ response: response, Voucher: this.order });
  }


  getOpeningStock(openingstock) {
    const params = {
      date: openingstock.date
    }

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/OpeningStock', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.GetLedger();
        this.openingStocks = JSON.parse(res['data'][0]['get_rpt_openingstock']);
        // this.setFoucus('ordertype');
        // this.common.showToast('Invoice Are Saved');
        return;

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }




 
}
