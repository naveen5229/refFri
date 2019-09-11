import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { MvsLrAssignComponent } from '../../modals/FreightRate/mvs-lr-assign/mvs-lr-assign.component';
import { MarketVehFreightStatementComponent } from '../../modals/FreightRate/market-veh-freight-statement/market-veh-freight-statement.component';
import { ViewMVSFreightStatementComponent } from '../../modals/FreightRate/view-mvsfreight-statement/view-mvsfreight-statement.component';



@Component({
  selector: 'mvs-freight-statement',
  templateUrl: './mvs-freight-statement.component.html',
  styleUrls: ['./mvs-freight-statement.component.scss']
})
export class MvsFreightStatementComponent implements OnInit {
  startTime = new Date(new Date().setDate(new Date().getDate() - 7));
  endTime = new Date();
  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  constructor(public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    private modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.viewMvcFreightStaement();
  }

  ngOnInit() {
  }

  viewMvcFreightStaement() {
    if (!this.startTime || !this.endTime) {
      this.common.showError("Dates cannot be blank.");
      return;
    }

    let params = {
      startTime: this.common.dateFormatter(this.startTime),
      endTime: this.common.dateFormatter(this.endTime)
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('FrieghtRate/getMVSFreightInvoices', params)
      .subscribe(res => {
        --this.common.loading;

        this.data = [];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};

        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }

        this.table.data.columns = this.getTableColumns();
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      //----Action-------
      this.valobj['Action'] = { class: '', icons: this.actionIcon(doc) };
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  actionIcon(row) {
    let actionIcons = [];
    actionIcons.push(
      {
        class: "far fa-eye",
        action: this.lrAssign.bind(this, row),
      },
      {
        class: "far fa-edit",
        action: this.openMvcFreightModal.bind(this, 'Edit', row),
      },

      {
        class: "fas fa-trash-alt",
        action: this.deleteMvsStatement.bind(this, row),
      }
    );

    if (row._lrcount > 0) {
      actionIcons.push({
        class: "fas fa-print",
        action: this.printMVSInvoice.bind(this, row),
      }

      )
    }

    return actionIcons;
  }

 
  lrAssign(row) {
    this.common.handleModalSize('class', 'modal-lg', '1300');
    this.common.params = { row: row };
    const activeModal = this.modalService.open(MvsLrAssignComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', });
    activeModal.result.then(data => {
      console.log('Date:', data);
      if (data) {
        this.viewMvcFreightStaement();
      }
    });
  }



  refresh() {
    this.viewMvcFreightStaement();
  }

  openMvcFreightModal(title, row, type?) {
    console.log("title:", title);
    console.log("Display:", row);
    this.common.params = { title: title, freightInvoice: row, type: type };
    console.log("alert:", this.common.params);
    const activeModal = this.modalService.open(MarketVehFreightStatementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      // console.log('Date:', data);
      this.viewMvcFreightStaement();
    });
  }


  deleteMvsStatement(row) {
    console.log("row:", row);
    let params = {
      id: row._id,
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('FrieghtRate/deleteMVSFreightInvoices', params)
            .subscribe(res => {
              this.common.loading--;
              if (res['data'][0]['r_id']) {
                this.common.showToast("Deleted successfully");
                this.viewMvcFreightStaement();
              }
              else {
                this.common.showError(res['data'][0]['r_msg']);
              }
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }
  printMVSInvoice(inv) {
    let invoice = {
      id: inv._id,
    }
    this.common.params = { invoice: invoice }
    const activeModal = this.modalService.open(ViewMVSFreightStatementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);

    });
  }
}