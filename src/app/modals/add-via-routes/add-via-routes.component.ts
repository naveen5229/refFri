import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date.service';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-via-routes',
  templateUrl: './add-via-routes.component.html',
  styleUrls: ['./add-via-routes.component.scss']
})
export class AddViaRoutesComponent implements OnInit {
  location = '';
  routeData = {
    routeName: null,
    kms: null,
    id:null
  };
  routeTypes = [{
    name: 'Loaded',
    id: '0'
  },
  {
    name: 'Empty',
    id: '1'
  }
  ];
  routeId = '0';
  

  constructor(private api: ApiService,
    private activeModal: NgbActiveModal,
    private common: CommonService,
    public dateService: DateService,
    private modalService: NgbModal) {
      if(this.common.params && this.common.params.editRoute){
        console.log("route:",this.common.params.editRoute);
        this.routeData.routeName=this.common.params.editRoute.routeName;
        this.routeData.id=this.common.params.editRoute.id ;
        this.routeId=this.common.params.editRoute.routeType ;
        this.routeData.kms=this.common.params.editRoute.kms;
      }
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  ngAfterViewInit() {
  }
  ngOnDestroy(){
    this.common.params=null;
  }

  add() {
    const params = {
      rowId:this.routeData.id ? this.routeData.id :null,
      name: this.routeData.routeName,
      kms: this.routeData.kms,
      routeType: this.routeId
    };
    console.log("Data :", params);
    this.common.loading++;
    this.api.post('ViaRoutes/insert', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("test", res['data'][0].y_msg);
        if (res['data'][0].y_id <= 0) {
          this.common.showError(res['data'][0].y_msg);
          
          return;
        }
        else {
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close({ response: res });
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal() {
    this.activeModal.close({response:false});
  }

}
