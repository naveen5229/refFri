import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationSelectionComponent } from '../../location-selection/location-selection.component';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-transport-agent',
  templateUrl: './add-transport-agent.component.html',
  styleUrls: ['./add-transport-agent.component.scss']
})
export class AddTransportAgentComponent implements OnInit {

  Transport={
    name:null,
    panNumber:null,
    gstNumber:null,
    city:null,
    address:null,
    sourceLat:null,
    sourceLng:null,
    sourceId:null
  }
  keepGoing = true;
  CityString = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal

  ) {
    this.common.handleModalSize('class', 'modal-lg', '500', 'px', 1);
   }

  ngOnDestroy(){}
ngOnInit() {
  }

  saveTransportAgent()
  {
    if(this.Transport.name==null || this.Transport.name=='')
    {
      this.common.showToast("Please Insert Name");
      return;
    }

    else if(this.Transport.panNumber==null || this.Transport.panNumber=='')
    {
      this.common.showToast("Please Insert PAN Number");
      return;
    }

    else if(this.Transport.gstNumber==null || this.Transport.gstNumber=='')
    {
      this.common.showToast("Please Insert GST Number");
      return;
    }
    //this.submitted = true;
    let params = {
      name: this.Transport.name,
      gstin:this.Transport.gstNumber,
      pan:this.Transport.panNumber,
      location:this.Transport.sourceId,
      address:this.Transport.address
    };
    console.log("Name:",this.Transport.name);
    console.log("Pan Number:",this.Transport.panNumber);
    console.log("Gst Number:",this.Transport.gstNumber);
    console.log("City:",this.Transport.city);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/InsertTransportAgent', params)
    
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.common.showToast(res['msg']);
        this.activeModal.close();

      }, err => {

        this.common.loading--;
        console.log(err);
      });
  }


  selectLocation(place1) {
 
      this.Transport.sourceLat = place1.lat;
      this.Transport.sourceLng = place1.long;
      this.Transport.sourceId = place1.id;
      this.Transport.city = place1.location || place1.name;
      this.Transport.city = this.Transport.city.split(",")[0];
      (<HTMLInputElement>document.getElementById('startname1')).value = this.Transport.city;
    
  }

  takeActionSource(res) {
    setTimeout(() => {
      console.log("Here", this.keepGoing, this.CityString.length, this.CityString);

      if (this.keepGoing && this.CityString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          console.log('response----', res.location);
          this.keepGoing = true;
          if (res.location.lat) {
            this.Transport.city = res.location.name;

            (<HTMLInputElement>document.getElementById('startname1')).value = this.Transport.city;
            this.Transport.sourceLat = res.location.lat;
            this.Transport.sourceLng = res.location.lng;
            this.Transport.sourceId = res.id;
            this.keepGoing = true;
          }
        })
      }
    }, 1000);

  }

  onChangeAuto1(search) {
      this.CityString = search;
      }

  closeModal()
  {
    this.activeModal.dismiss({ex: 'Modal has been closed'});
  }

}
