import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'ledgermapping',
  templateUrl: './ledgermapping.component.html',
  styleUrls: ['./ledgermapping.component.scss']
})
export class LedgermappingComponent implements OnInit {
  secondaryData=[];
  selectedName = '';
  ledgerMapping = {
    ledger :{
        name:'All',
        id:0
      },
      group :{
        name:'All',
        id:0
      },
    };
    ledgerMappingData=[];
    ledgerList=[];
    activeId='secondaryname';
    selectedRow = -1;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event) {
      this.keyHandler(event);
    }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
      this.common.refresh = this.refresh.bind(this);  
      this.getSecondaryData();
      this.getLedgerList();
      this.setFoucus('secondaryname');
      this.common.currentPage = 'Ledger Mapping';
    }


  ngOnInit() {
  }
   
  refresh(){
    this.getSecondaryData();
    this.getLedgerList();
    this.setFoucus('secondaryname');
  }

  getSecondaryData() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetSecondaryAccount', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.secondaryData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getLedgerView() {
  //  console.log('Ledger:', this.ledgerMapping);
    let params = {
      ledger: this.ledgerMapping.ledger.id,
      group: this.ledgerMapping.group.id,
    };
    
    this.common.loading++;
    this.api.post('Accounts/getLedgerMapping', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerMappingData = res['data'];
        this.setFoucus('secondaryname');
        if (this.ledgerMappingData.length) {
          document.activeElement['blur']();
          this.selectedRow = 0;
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 
  }

  getLedgerList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerList = res['data'];
        
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 

  }

  
  onSelected(selectedData, type, display) {
    this.ledgerMapping[type].name = selectedData[display];
    this.ledgerMapping[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }
  
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter') {
       if (this.activeId.includes('secondaryname')) {
        this.setFoucus('ledger');
      }else  if (this.activeId.includes('ledger')) {
        this.setFoucus('submit');
      }
    } else if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.ledgerMappingData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.ledgerMappingData.length - 1) this.selectedRow++;

    }
    
  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }
}
