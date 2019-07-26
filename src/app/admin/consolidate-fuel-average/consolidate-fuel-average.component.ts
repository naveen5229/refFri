import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../../services/date.service';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'consolidate-fuel-average',
  templateUrl: './consolidate-fuel-average.component.html',
  styleUrls: ['./consolidate-fuel-average.component.scss']
})
export class ConsolidateFuelAverageComponent implements OnInit {

  startTime = null;
  endTime = null;
  consolFuelAvg = [];
  showTable = false;
  table = null;

  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public dateService: DateService,
    private datePipe: DatePipe
  ) {
    let today = new Date();
    this.endTime = new Date(today);
    let day = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    this.startTime = new Date(today.getFullYear(), today.getMonth(), 1);
    //this.startTime = new Date(today.setDate(today.getDate() - day + 1));
    this.getConsolidateFuelAvg();
    this.common.refresh = this.refresh.bind(this);
    

  }

  ngOnInit() {
  }

  
  refresh() {
    console.log('Refresh');
    this.getConsolidateFuelAvg();
    }
  getConsolidateFuelAvg() {
    console.log('startTime', this.startTime);
    this.consolFuelAvg = [];
    let startTime = this.common.dateFormatter(this.startTime);
    let endTime = this.common.dateFormatter(this.endTime);

    let params = {
      start_time: startTime,
      end_time: endTime
    };
    this.common.loading++;
    this.api.post('FuelDetails/getFuelAvgWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.consolFuelAvg = res['data'];
        if (this.consolFuelAvg != null) {
          this.showTable = true;
          this.table = this.setTable();
        } else {
          this.showTable = false;
          this.common.showToast('Record Not Found!!');
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }
  setTable() {
    let headings = {
      RegNo: { title: 'RegNo', placeholder: 'RegNo' },
      startTime: { title: 'Start Time', placeholder: 'Start Time' },
      endTime: { title: 'End Time', placeholder: 'End Time' },
      litre: { title: 'Litre', placeholder: 'Litre' },
      Avg: { title: 'Avg', placeholder: 'Avg' },
      totalDistance: { title: 'Total Distance ', placeholder: 'Total Distance' },
      loadingDistance: { title: 'Loading Distance', placeholder: 'Loading Distance' },
      unloadingDistance: { title: 'Unloading Distance', placeholder: 'Unloading Distance' }


      //action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
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
    this.consolFuelAvg.map(res => {
      let column = {
        RegNo: { value: res.regno },
        startTime: { value: this.datePipe.transform(res.start_time, 'dd-MMM hh:mm a') },
        endTime: { value: this.datePipe.transform(res.end_time, 'dd-MMM hh:mm a') },
        litre: { value: res.litre },
        Avg: { value: res.avg },
        totalDistance: { value: res.total_distance },
        loadingDistance: { value: res.loading_distance },
        unloadingDistance: { value: res.unloading_distance },
        style: { background: res.is_probable_issue ? 'lightcoral' : '' },

        rowActions: {
          click: 'selectRow'
        }

      };
      columns.push(column);
    });
    return columns;
  }


}
