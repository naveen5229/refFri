import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'ticket-subscribe',
  templateUrl: './ticket-subscribe.component.html',
  styleUrls: ['./ticket-subscribe.component.scss']
})
export class TicketSubscribeComponent implements OnInit {

  ticketSubscribe = {
    refType: '1',
    refId: '',
    isActive: false,
    isOld: false
  };
  table = null;
  vscEntry = [];

  constructor(private modalService: NgbModal, public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    public activeModal: NgbActiveModal) {
    this.getVscEntry();
  }

  ngOnInit() {
  }

  subscribe() {


    let params = {
      ref_type: parseInt(this.ticketSubscribe.refType),
      ref_id: this.ticketSubscribe.refId,
      is_active: this.ticketSubscribe.isActive ? 1 : 0,
      is_old: this.ticketSubscribe.isOld ? 1 : 0
    };
    console.log('params to insert', params);
    this.common.loading++;
    this.api.post('FoTicketSubscribe/insertVscEntry', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data']);
        if (res['success']) {
          this.common.showToast(res['msg']);
          this.getVscEntry();
        }
      }, err => {
        this.common.loading--
        this.common.showError();
      })
  }
  getFolist(value) {
    this.ticketSubscribe.refId = value.id;
  }
  getGroup(value) {
    this.ticketSubscribe.refId = value.id;
  }

  getVscEntry() {
    this.common.loading++;
    this.api.get('FoTicketSubscribe/getVscEntry')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.vscEntry = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      Type: { title: 'Type', placeholder: 'Type' },
      isActive: { title: 'isActive', placeholder: 'isActive' },
      isOld: { title: 'isOld', placeholder: 'isOld' },
      Name: { title: 'Name', placeholder: 'Name' }
    };


    return {
      vscEntry: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.vscEntry.map(R => {

      let column = {
        Type: { value: R.type },
        isActive: { value: R.is_active },
        isOld: { value: R.is_old },
        Name: { value: R.name }
      };

      columns.push(column);

    });
    return columns;
  }
  closeModal() {
    this.activeModal.close();
  }

}
