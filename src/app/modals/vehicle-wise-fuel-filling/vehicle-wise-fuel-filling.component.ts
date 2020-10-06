import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { MapService } from '../../services/map.service';

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
  value1 = [];
  table = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    //  private zone: NgZone,
    public mapService: MapService,
    public datepipe: DatePipe,
    private modalService: NgbModal) {

    this.value1 = this.common.params;
    if (this.value1 == null) {
      this.value1 = [];
      this.table = null;
    }


    this.table = this.setTable();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }
  // }
  setTable() {
    let headings = {
      vehicle_id: { title: 'Vehicle id', placeholder: 'Vehicle id' },
      regno: { title: 'regno', placeholder: 'regno' },
      total: { title: 'total', placeholder: 'total' },
      start_time: { title: 'start time', placeholder: 'start time' },
      end_time: { title: 'end time', placeholder: 'end time' },
      notisfull: { title: 'notisfull', placeholder: 'notisfull' },
      notfse: { title: 'notfse', placeholder: 'notfse' },
      isfullfse: { title: 'eligible Entry', placeholder: 'eligible Entry' },


    };
    return {
      value1: {
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
    this.value1.map(req => {
      let column = {
        vehicle_id: { value: req.vehicle_id },
        regno: { value: req.regno },
        total: { value: req.total == null ? "-" : req.total },
        start_time: { value: req.start_time == null ? "-" : this.common.changeDateformat(req.start_time) },
        end_time: { value: req.end_time == null ? "-" : this.common.changeDateformat(req.end_time) },
        notisfull: { value: req.notisfull },
        notfse: { value: req.notfse },
        isfullfse: { value: req.isfullfse == null ? "-" : req.isfullfse },


      };
      columns.push(column);
    });
    return columns;
  }

}
