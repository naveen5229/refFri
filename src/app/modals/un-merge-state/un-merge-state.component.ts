import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let google: any;

@Component({
  selector: 'un-merge-state',
  templateUrl: './un-merge-state.component.html',
  styleUrls: ['./un-merge-state.component.scss']
})
export class UnMergeStateComponent implements OnInit {
  unMergeStatus = {
    vehicleId: null,
    regno: null,

  };
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  location = {
    lat: 26.9124336,
    lng: 75.78727090000007,
    name: '',
    time: ''
  };
  unMergeEvents = [];
  constructor(public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1600', 'px');
    if (this.common.params && this.common.params.unMergeStateData) {
      this.unMergeStatus.vehicleId = this.common.params.unMergeStateData.vehicleId;
      this.unMergeStatus.regno = this.common.params.unMergeStateData.regno;
      console.log("vehicle Id:", this.unMergeStatus);
      this.getUnMergeStates();
    }
  }

  ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }

  ngAfterViewInit() {
    console.log('ionViewDidLoad MarkerLocationPage');
    this.loadMap(this.location.lat, this.location.lng);
  }

  loadMap(lat = 26.9124336, lng = 75.78727090000007) {
    let mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 8,
      disableDefaultUI: true,
      mapTypeControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scaleControl: true,
      zoomControl: true,
      styles: [{
        featureType: 'all',
        elementType: 'labels',
        stylers: [{
          visibility: 'on'
        }]
      }]

    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  getUnMergeStates() {
    let params = "vehicleId=" + this.unMergeStatus.vehicleId;
    console.log(params);
    this.common.loading++;
    this.api.get('HaltOperations/getUnmergedLrState?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Api result,", res);
        this.unMergeEvents = res['data'];
        // this.clearAllMarkers();
        // this.createMarkers(res['data']);
        // this.resetBtnStatus();
        // // ------------------------ Route Mapper Code (Authored by UJ) ----------------------
        // let startElement = this.vehicleEvents.find((element) => {
        //   return !(element.desc + "").includes('LT');
        // });
        // this.vehicleEvents.forEach((element) => {
        //   if ((element.haltTypeId == 21 || element.haltTypeId == 11)
        //     && (element.desc + "").includes('LT'))
        //     element.lastType = element.haltTypeId;
        //   else
        //     element.lastType = null;
        // });
        // console.log("StartElement", startElement);
        // if (startElement) {
        //   let start = startElement.startTime;
        //   let startIndex = this.vehicleEvents.indexOf(startElement);
        //   let end = this.vehicleEvents[this.vehicleEvents.length - 1].endTime;
        //   console.log(res);
        //   this.vehicleEventsR = [];
        //   let vehicleEvents = res['data'];
        //   let realStart = new Date(vehicleEvents[startIndex].startTime) < new Date(start) ?
        //     vehicleEvents[startIndex].startTime : start;
        //   let realEnd = null;
        //   if (vehicleEvents[0].endTime)
        //     realEnd = new Date(vehicleEvents[vehicleEvents.length - 1].endTime) > new Date(end) ?
        //       vehicleEvents[vehicleEvents.length - 1].endTime : end;
        //   let totalHourDiff = 0;
        //   if (vehicleEvents.length != 0) {
        //     totalHourDiff = this.common.dateDiffInHours(realStart, realEnd, true);
        //     console.log("Total Diff", totalHourDiff);
        //   }
        //   for (let index = startIndex; index < vehicleEvents.length; index++) {
        //     vehicleEvents[index].mIndex = index;
        //     startIndex++;
        //     vehicleEvents[index].position = (this.common.dateDiffInHours(
        //       realStart, vehicleEvents[index].startTime) / totalHourDiff) * 98;
        //     vehicleEvents[index].width = (this.common.dateDiffInHours(
        //       vehicleEvents[index].startTime, vehicleEvents[index].endTime, true) / totalHourDiff) * 98;
        //     console.log("Width", vehicleEvents[index].width);
        //     this.vehicleEventsR.push(vehicleEvents[index]);
        //   }
        //   console.log("VehicleEvents", this.vehicleEventsR);
        // }



      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log(err);
      })
  }
}
