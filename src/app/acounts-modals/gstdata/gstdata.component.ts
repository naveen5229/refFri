import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'gstdata',
  templateUrl: './gstdata.component.html',
  styleUrls: ['./gstdata.component.scss']
})
export class GstdataComponent implements OnInit {
  data=[];
  pagename1='';
  pagename2='';
  igsttotal=0;
  sgsttotal=0;
  cgsttotal=0;
  totalamount=0;
  constructor(private activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
      if (this.common.params) {
        console.log("After the modal Open:", this.common.params);
  
        this.data = this.common.params.tempdata;
        this.pagename1 = 'Party Gst State Code : ' + this.common.params.partycode;
        this.pagename2 = 'Branch State Gst Code : ' + this.common.params.branchcode;
        this.data.map((mapdata)=>{
          console.log('mapdata',mapdata.igst,mapdata,mapdata['igst']);
          this.igsttotal += mapdata.igst;
          this.sgsttotal += mapdata.sgst;
          this.cgsttotal += mapdata.cgst;
          this.totalamount += mapdata.amount;
        })
      }
     }

  ngOnInit() {
  }
  modelCondition() {
    //  this.showConfirm = flag;
      this.activeModal.close({ });
   //   event.preventDefault();
     // return;
    }

}
