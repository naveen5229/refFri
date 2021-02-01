import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  unMergeEvents = [];
  vehicleEventsR = [];
  Markers = [];
  bounds = null;
  btnStatus = true;
  isChecks = {};
  onlyDrag = false;
  polygons = [];

  constructor(public modalService: NgbModal,
    public common: CommonService,
    public mapService: MapService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1600', 'px');
    if (this.common.params && this.common.params.unMergeStateData) {
      this.unMergeStatus.vehicleId = this.common.params.unMergeStateData.vehicleId;
      this.unMergeStatus.regno = this.common.params.unMergeStateData.regno;

    }
  }

  ngOnDestroy(){}
ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.zoomMap(5);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });

    setTimeout(() => {

      this.getUnMergeStates();
      this.mapService.addListerner(this.mapService.map, 'click', evt => {
      });
    }, 1000);
    console.log('ionViewDidLoad MarkerLocationPage');
  }



  getUnMergeStates() {
    let params = "vehicleId=" + this.unMergeStatus.vehicleId;
    console.log(params);
    this.common.loading++;
    this.api.get('HaltOperations/getUnmergedLrState?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.unMergeEvents = res['data'];
        this.Markers = this.mapService.createMarkers(this.unMergeEvents, false, true);
        this.resetBtnStatus();
        // ------------------------ Route Mapper Code (Authored by LS) ----------------------
        let startElement = this.unMergeEvents.find((element) => {
          return !(element.desc + "").includes('LT');
        });
        this.unMergeEvents.forEach((element) => {
          if ((element.haltTypeId == 21 || element.haltTypeId == 11)
            && (element.desc + "").includes('LT'))
            element.lastType = element.haltTypeId;
          else
            element.lastType = null;
        });
        console.log("StartElement", startElement);
        if (startElement) {
          let start = startElement.startTime;
          let startIndex = this.unMergeEvents.indexOf(startElement);
          let end = this.unMergeEvents[this.unMergeEvents.length - 1].endTime;
          console.log(res);
          this.vehicleEventsR = [];
          let unMergeEvents = res['data'];
          let realStart = new Date(unMergeEvents[startIndex].startTime) < new Date(start) ?
            unMergeEvents[startIndex].startTime : start;
          let realEnd = null;
          if (unMergeEvents[0].endTime)
            realEnd = new Date(unMergeEvents[unMergeEvents.length - 1].endTime) > new Date(end) ?
              unMergeEvents[unMergeEvents.length - 1].endTime : end;
          let totalHourDiff = 0;
          if (unMergeEvents.length != 0) {
            totalHourDiff = this.common.dateDiffInHours(realStart, realEnd, true);
            console.log("Total Diff", totalHourDiff);
          }
          for (let index = startIndex; index < unMergeEvents.length; index++) {
            unMergeEvents[index].mIndex = index;
            startIndex++;
            unMergeEvents[index].position = (this.common.dateDiffInHours(
              realStart, unMergeEvents[index].startTime) / totalHourDiff) * 98;
            unMergeEvents[index].width = (this.common.dateDiffInHours(
              unMergeEvents[index].startTime, unMergeEvents[index].endTime, true) / totalHourDiff) * 98;
            console.log("Width", unMergeEvents[index].width);
            this.vehicleEventsR.push(unMergeEvents[index]);
          }
          // this.mapService.resetMarker();
        }

      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log(err);
      })
  }
  mapReset() {
    this.getUnMergeStates();
  }



  resetBtnStatus() {
    this.btnStatus = true;
    this.unMergeEvents.forEach(vehicleEventDetail => {
      if (vehicleEventDetail.color == 'ff13ec') {
        this.btnStatus = false;
        return;
      }
    });
  }

  openSmartTool(i, vehicleEvent) {
    this.isChecks = {};
    console.log(this.onlyDrag);
    if (!this.onlyDrag) {
      this.unMergeEvents.forEach(vEvent => {
        if (vEvent != vehicleEvent)
          vEvent.isOpen = false;
      });
      vehicleEvent.isOpen = !vehicleEvent.isOpen;
      this.zoomFunctionality(i, vehicleEvent);
      // this.getSites();
    }
    this.onlyDrag = false;
  }

  zoomFunctionality(i, vehicleEvent) {
    console.log("vehicleEvent", vehicleEvent);
    this.mapService.zoomAt(this.mapService.createLatLng(vehicleEvent.lat, vehicleEvent.long), 16);
    console.log("vehicleEvent.siteId", vehicleEvent.site_id)
    if (vehicleEvent.site_id) {
      console.log("vehicleEvent.siteId", vehicleEvent.site_id)
      this.fnLoadGeofence(vehicleEvent.site_id);
    }
  }


  fnLoadGeofence(siteId) {
    console.log("siteID:", siteId);
    this.common.loading++;
    let params = {
      siteId: siteId
    };

    this.api.post('SiteFencing/getSiteFences', params)
      .subscribe(res => {
        let data = res['data'];
        let count = Object.keys(data).length;
        console.log('Res: ', res['data']);
        if (count > 0) {
          let latLngsArray = [];
          let mainLatLng = null;
          for (const datax in data) {
            if (data.hasOwnProperty(datax)) {
              const datav = data[datax];
              if (datax == siteId)
                mainLatLng = datav.latLngs;
              latLngsArray.push(datav.latLngs);
              console.log("Multi", datax);
            }
          }
          this.mapService.createPolygons(latLngsArray)
        }
        else {
          console.log("Else");
        }
        this.common.loading--;
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log(err);
      });
  }


  drop(event: CdkDragDrop<string[]>) {
    let movedItem = this.unMergeEvents[event.previousIndex];
    let movedOnItem = this.unMergeEvents[event.currentIndex];
    console.log("Data", event);
    console.log('Previous Event: ', event.previousIndex, this.unMergeEvents[event.previousIndex]);
    console.log("current Event", event.currentIndex, this.unMergeEvents[event.currentIndex]);
    console.log("Data", event.container.data);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.siteMerge(movedItem, movedOnItem);
  }


  // onDragEnded(event, index, movedItem) {
  //   console.log('onDragEnded: ', event, index, movedItem);
  //   if (event) return;
  //   let offsetsCurrent = document.getElementById('unMergeEvent-row-' + index).getBoundingClientRect();
  //   let middle = (offsetsCurrent.top + offsetsCurrent.bottom) / 2;
  //   let movedOnItem = null;
  //   this.unMergeEvents.map((unMergeEvent, i) => {
  //     if (index !== i) {
  //       let offset = document.getElementById('unMergeEvent-row-' + i).getBoundingClientRect();
  //       if (middle >= offset.top && middle <= offset.bottom) {
  //         movedOnItem = unMergeEvent;
  //       }
  //     }
  //   });

  //   if (movedOnItem) {
  //     this.common.showToast('Moved Item Detected');
  //     this.siteMerge(movedItem, movedOnItem);
  //   } else {
  //     this.common.showError('You have moved to different location');
  //   }
  // }

  siteMerge(movedItem, movedOnItem) {
    console.log('Moved: ', movedItem);
    console.log('Moved On: ', movedOnItem);
    if (movedItem.id == null || movedOnItem.id == null) {
      return this.common.showError("Select valid Record");
    }
    let params = {
      dragHaltId: movedItem.id,
      dropHaltId: movedOnItem.id
    };
    console.log("Params......", params);
    this.common.loading++;
    this.api.post('HaltOperations/mergeHalts', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Api_______________", res['data']);

        if (res['success']) {
          this.mapReset();
        } else {
          this.common.showToast(res['msg']);
          this.mapReset();
        }
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError(err);
      });
  }



}
