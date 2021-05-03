import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../../services/date.service';
import { DatePipe } from '@angular/common';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fo-fs-mapping',
  templateUrl: './fo-fs-mapping.component.html',
  styleUrls: ['./fo-fs-mapping.component.scss']
})
export class FoFsMappingComponent implements OnInit {
  table = null;
  foFsMapping = [];
  fsid = null;
  foid = null;

  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public dateService: DateService,
    private datePipe: DatePipe
  ) {
    this.getFoFsMapping();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }


  refresh() {
    console.log('Refresh');
    this.getFoFsMapping();
  }
  getFoFsMapping() {
    this.common.loading++;
    this.api.get('Fuel/getFoFsMapping')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.foFsMapping = res['data'] || [];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  addFoFsMapping() {
    if (!this.foid) {
      this.common.showToast('Fo Is Missing');
      return;
    } else if (!this.fsid) {
      this.common.showToast('Fuel Station Is Missing');
      return;
    }
    let params = {
      foid: this.foid,
      fsid: this.fsid
    };
    this.common.loading++;
    this.api.post('Fuel/insertFoFsMapping', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.common.showToast(res['msg']);
        if (res['success'])
          this.getFoFsMapping();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getFo(foList) {
    this.foid = foList.id;
  }

  getFs(fsList) {
    this.fsid = fsList.id;
  }

  setTable() {
    let headings = {
      StationName: { title: 'Station Name', placeholder: 'Station Name' },
      SiteName: { title: 'Site Name', placeholder: 'Site Name' },
      Location: { title: 'Location', placeholder: 'Location' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "72vh"

      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.foFsMapping.map(mapped => {
      let column = {
        StationName: { value: mapped.station_name },
        SiteName: { value: mapped.site_name },
        Location: { value: mapped.location },
        action: {
          value: '', isHTML: false, action: null, icons: [

            { class: " fa fa-trash remove", action: this.deleteMapping.bind(this, mapped) }
          ]
        },
        rowActions: {
          click: 'selectRow'
        }

      };
      columns.push(column);
    });
    return columns;
  }

  deleteMapping(details) {

    let params = {
      rowid: details.id
    };
    console.log('rowid', params);
    this.common.loading++;
    this.api.post('Fuel/deleteFoFsMapping', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg'])
        if (res['success'])
          this.getFoFsMapping();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

}
