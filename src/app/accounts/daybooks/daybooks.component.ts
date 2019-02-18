import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'daybooks',
  templateUrl: './daybooks.component.html',
  styleUrls: ['./daybooks.component.scss']
})
export class DaybooksComponent implements OnInit {
  DayBook = {
    enddate:'',
    startdate:'',
    ledger :{
        name:'',
        id:''
      },
      branch :{
        name:'',
        id:''
      },
      vouchertype :{
        name:'',
        id:''
      }
    
    };
  DayData=[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
   // this.getDayBook();
    }

  ngOnInit() {
  }

  getDayBook() {
    console.log('Accounts:', this.DayBook);
    let params = {
      startdate: this.DayBook.startdate,
      enddate: this.DayBook.enddate,
      ledger: this.DayBook.ledger.id,
      branch: this.DayBook.branch.id,
      vouchertype: this.DayBook.vouchertype.id,
    };
    
    this.common.loading++;
    this.api.post('Company/GetDayBook', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.DayData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 

  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.DayBook[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log(this.DayBook[date]);
    });
  }
  
  onSelected(selectedData, type, display) {
    this.DayBook[type].name = selectedData[display];
    this.DayBook[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }

}
