import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit {
  title = '';
  data = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
      this.title = this.common.params.title;
      this.getEmpDashboard();
     }

    closeModal(response) {
      this.activeModal.close({ response: response });
    }
  ngOnInit() {
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
  getEmpDashboard() {
    this.common.loading++;
    this.api.get('Admin/empDashboard', { })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        console.log("data:");
        console.log(this.data);
        
        let first_rec = this.data['summary'][0];
        for (var key in first_rec) {
          
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          
        }
        this.table.data.columns = this.getTableColumns();
        console.log("table:");
        console.log(this.table);
      }, err => {

        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    for(var i= 0; i<this.data['summary'].length; i++) {
      this.valobj = {};
      for(let j=0; j<this.headings.length; j++) {j
        this.valobj[this.headings[j]] = {value: this.data['summary'][i][this.headings[j]], class: 'black', action:  ''};
      }
      columns.push(this.valobj);
    }
    return columns;
  }
}
