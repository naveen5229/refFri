import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../../services/date.service';



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
    public dateService: DateService
  ) {
    let today = new Date();
    this.endTime = new Date(today);
    this.startTime = new Date(today.setDate(today.getDate() - 25))
    this.getConsolidateFuelAvg();
  }

  ngOnInit() {
  }
  getConsolidateFuelAvg() {
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
      litre: { title: 'Litre', placeholder: 'Litre' },
      Avg: { title: 'Avg', placeholder: 'Avg' },
      totalDistance: { title: 'Total Distance ', placeholder: 'Total Distance' },


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
        litre: { value: res.litre },
        Avg: { value: res.avg },
        totalDistance: { value: res.total_distance },



        rowActions: {
          click: 'selectRow'
        }

      };
      columns.push(column);
    });
    return columns;
  }


}
