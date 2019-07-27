import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    address:null
  }
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal

  ) {
    this.common.handleModalSize('class', 'modal-lg', '500', 'px', 1);
   }

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
      location:this.Transport.city,
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

  closeModal()
  {
    this.activeModal.dismiss({ex: 'Modal has been closed'});
  }

}
