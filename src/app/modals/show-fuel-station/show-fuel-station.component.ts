import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'show-fuel-station',
  templateUrl: './show-fuel-station.component.html',
  styleUrls: ['./show-fuel-station.component.scss']
})
export class ShowFuelStationComponent implements OnInit {

  fuelStation = [];
  table = null;

  constructor(private activeModal: NgbActiveModal, public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private modalService: NgbModal) {
    this.getFuelStation();
  }

  ngOnInit() {
  }

  getFuelStation() {
    this.common.api.get('Fuel/getFuelStation', null)
      .subscribe(res => {
        console.log('res', res['data']);
        if (res['data'].length) {
          this.fuelStation = res['data'];
        } else {
          this.common.showToast('No Record Found !!');
        }
        this.table = this.setTable();

      }, err => {
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      name: { title: 'name', placeholder: 'name' },
      location: { title: 'location', placeholder: 'location' },
      site_id: { title: 'site_id', placeholder: 'site_id' },
      addtime: { title: 'addtime', placeholder: 'addtime' },
      lat: { title: 'lat', placeholder: 'lat' },
      long: { title: 'long', placeholder: 'long' }
    };


    return {
      fuelStation: {
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
    this.fuelStation.map(R => {

      let column = {
        name: { value: R.name },
        location: { value: R.location },
        site_id: { value: R.site_id },
        addtime: { value: this.datePipe.transform(R.addtime, 'dd MMM HH:mm ') },
        Lat: { value: R.lat },
        Long: { value: R.long },
      };

      columns.push(column);

    });
    return columns;
  }


  closeModal() {
    this.activeModal.close();
  }

}
