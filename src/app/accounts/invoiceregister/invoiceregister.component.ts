import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'invoiceregister',
  templateUrl: './invoiceregister.component.html',
  styleUrls: ['./invoiceregister.component.scss']
})
export class InvoiceregisterComponent implements OnInit {
  invoiceRegister = {
    endDate:'',
    startDate:'',
    custCode:'',
    code:'',
    ledger :{
        name:'',
        id:''
      },
      branch :{
        name:'',
        id:''
      },
      orderType :{
        name:'',
        id:''
      }
    
    };
    invoiceRegisterData=[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
    }

  ngOnInit() {
  }

  getInvoiceRegister() {
    console.log('Invoice Reister:', this.invoiceRegister);
    let params = {
      startdate: this.invoiceRegister.startDate,
      enddate: this.invoiceRegister.endDate,
      ledger: this.invoiceRegister.ledger.id,
      branch: this.invoiceRegister.branch.id,
      code: this.invoiceRegister.code,
      custCode: this.invoiceRegister.custCode,
      orderType: this.invoiceRegister.orderType.id,
    };
    
    this.common.loading++;
    this.api.post('Accounts/getInvoiceRegister', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.invoiceRegisterData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 

  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.invoiceRegister[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log(this.invoiceRegister[date]);
    });
  }
  
  onSelected(selectedData, type, display) {
    this.invoiceRegister[type].name = selectedData[display];
    this.invoiceRegister[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }
}
