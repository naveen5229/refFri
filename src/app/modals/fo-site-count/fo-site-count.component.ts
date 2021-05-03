import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fo-site-count',
  templateUrl: './fo-site-count.component.html',
  styleUrls: ['./fo-site-count.component.scss']
})
export class FoSiteCountComponent implements OnInit {
  startDate = null;
  //endDate = null;
  foid = null;
  data = [];
  table = null;
  constructor(private modalService: NgbModal,
    private mapService: MapService,
    private api: ApiService,
    private activeModal: NgbActiveModal,
    private common: CommonService,
    public dateService: DateService) {


    let endDay, startday;
    let today = new Date();
    // this.endDate = new Date(today.setDate(today.getDate()))

    this.startDate = new Date(today.setDate(today.getDate() - 30));
    this.table = this.setTable();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  selectFoUser(user) {
    this.foid = user.id;
  }
  closeModal(data?) {
    this.activeModal.close();
  }
  setTable() {
    let headings = {
      fo_name: { title: 'fo_name', placeholder: 'fo_name' },
      site_name: { title: 'site_name', placeholder: 'site_name' },
      site_loc_name: { title: 'site_loc_name', placeholder: 'site_loc_name' },
      sum: { title: 'sum', placeholder: 'sum' },
      ratio: { title: 'ratio', placeholder: 'ratio' },
      // entry_type: { title: 'Transaction Type', placeholder: 'Transaction Type' },

    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.data.map(req => {
      let column = {
        fo_name: { value: req.fo_name },
        site_name: { value: req.site_name },
        site_loc_name: { value: req.site_loc_name == null ? "-" : req.site_loc_name },
        sum: { value: req.sum == null ? "-" : req.sum },
        ratio: { value: req.ratio == null ? "-" : req.ratio },
        // entry_type: { value: req.entry_type == null ? "-" : req.entry_type },


      };
      columns.push(column);
    });
    return columns;
  }
  getView() {
    let params = "foid=" + this.foid + "&startFrom=" + this.common.dateFormatter1(this.startDate);
    this.common.loading++;
    let response;
    this.api.get('site/setFoSiteCount?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          this.table = null;

        }
        this.table = this.setTable();
        // this.table.data.columns = this.getTableColumns(this.formattData());

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
}
