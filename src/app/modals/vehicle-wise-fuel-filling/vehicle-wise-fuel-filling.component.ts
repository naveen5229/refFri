import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { MapService } from '../../services/map.service';
import { detachProjectedView } from '@angular/core/src/view/view_attach';

@Component({
  selector: 'vehicle-wise-fuel-filling',
  templateUrl: './vehicle-wise-fuel-filling.component.html',
  styleUrls: ['./vehicle-wise-fuel-filling.component.scss']
})
export class VehicleWiseFuelFillingComponent implements OnInit {
  dates = {
    date: this.common.dateFormatter(new Date())
  };
  data = [];
  table = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    //  private zone: NgZone,
    public mapService: MapService,
    public datepipe: DatePipe,
    private modalService: NgbModal) {

    this.getreport();

  }

  ngOnInit() {
  }
  getDate(date) {
    this.common.params = { ref_page: "vehicle-wise-fuel-filling" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
    });
  }
  closeModal() {
    this.activeModal.close();
  }
  // }
  setTable() {
    let headings = {
      vehicle_id: { title: 'Vehicle id', placeholder: 'Vehicle id' },
      regno: { title: 'regno', placeholder: 'regno' },
      count: { title: 'count', placeholder: 'count' },
      start_time: { title: 'start time', placeholder: 'start time' },
      end_time: { title: 'end time', placeholder: 'end time' },

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
        vehicle_id: { value: req.vehicle_id },
        regno: { value: req.regno },
        count: { value: req.count == null ? "-" : req.count },
        start_time: { value: req.start_time == null ? "-" : this.common.changeDateformat(req.start_time) },
        end_time: { value: req.end_time == null ? "-" : this.common.changeDateformat(req.end_time) },


      };
      columns.push(column);
    });
    return columns;
  }
  getreport() {
    console.log('Dates', this.dates.date);
    let params = "date=" + this.dates.date

    console.log('params', params);


    this.common.loading++;
    this.api.get('Fuel/getVehWiseTotalFilling?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          this.table = null;

        }
        this.table = this.setTable();
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
}
