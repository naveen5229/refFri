import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { EditFillingComponent } from '../../../app/modals/edit-filling/edit-filling.component';
import { ImportFillingsComponent } from '../../../app/modals/import-fillings/import-fillings.component';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'fuel-fillings',
  templateUrl: './fuel-fillings.component.html',
  styleUrls: ['./fuel-fillings.component.scss'],
  providers: [NgbPaginationConfig]
})
export class FuelFillingsComponent implements OnInit {
  fillingData = [];
  headings = [];
  table = {
    data: {
      headings: {
        id: { title: 'ID', placeholder: 'ID' },
        date: { title: 'Date', placeholder: 'Date' },
        regno: { title: 'Regno', placeholder: 'Regno' },
        litres: { title: 'Litres', placeholder: 'Litres' },
        rate: { title: 'Rate', placeholder: 'Rate' },
        amount: { title: 'Amount', placeholder: 'Amount' },
        addtime: { title: 'Addtime', placeholder: 'Addtime' },
        username: { title: 'Username', placeholder: 'Username' },
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  

  constructor(public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    config: NgbPaginationConfig) {
      config.size = 'sm';
      config.boundaryLinks = true;
    this.getFillingData();
  }

  ngOnInit() {
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getFillingData() {
    this.common.loading++;
    let user_id = this.user._details.id;
    if (this.user._loggedInBy == 'admin')
      user_id = this.user._customer.id;
    this.fillingData = [];
    this.api.post('FuelDetails/getFuelFillingEntries', {})
      .subscribe(res => {
        this.common.loading--;
        this.fillingData = res['data'];
        this.fillingData = this.fillingData.slice(1, 100);
        console.info("filling Data", this.fillingData);
        console.log("hdgs:");
        console.log(this.headings);
        console.log(this.table.data.headings);

        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  openData(rowfilling) {
    this.common.params = { rowfilling, title: 'Edit Fuel Filling' };
    const activeModal = this.modalService.open(EditFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
     
    });
  }

  addFuel() {
    let rowfilling = {
      fdate: null,
      litres: null,
      is_full: null,
      regno: null,
      rate: null,
      amount: null,
      pp: null,
      fuel_station_id: null,
      vehicle_id: null,
      id: null
    };
    this.common.params = { rowfilling, title: 'Add Fuel Filling' };
    const activeModal = this.modalService.open(EditFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        window.location.reload();
      }
    });
  }

  addCsv() {
    const activeModal = this.modalService.open(ImportFillingsComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        window.location.reload();
      }
    });
  }

  getTableColumns() {
    let columns = [];

    this.fillingData.map(frec => {
      //valobj[this.headings[i]] = { value: val, class: (val > 0 )? 'blue': 'black', action: val >0 ? this.openData.bind(this, docobj, status) : '' };
      let column = {
        id: { value: frec.id, class: 'blue', action: this.openData.bind(this, frec) },
        date: { value: this.datePipe.transform(frec.date, 'dd MMM yyyy') },
        regno: { value: frec.regno },
        litres: { value: frec.litres },
        rate: { value: frec.rate },
        amount: { value: frec.amount },
        addtime: { value: this.datePipe.transform(frec.addtime, 'dd MMM yyyy h:mm:ss a') },
        username: { value: frec.username },
        rowActions: {}
      };

      columns.push(column);
    });

    return columns;
  }
}
