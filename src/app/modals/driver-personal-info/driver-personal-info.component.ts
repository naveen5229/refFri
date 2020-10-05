import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'driver-personal-info',
  templateUrl: './driver-personal-info.component.html',
  styleUrls: ['./driver-personal-info.component.scss']
})
export class DriverPersonalInfoComponent implements OnInit {
  driverInfo = [];
  staticImagePath = "assets/images/default-image.jpg";
  name = '';
  address = '';
  pNumber = '';
  sNumber = '';
  DOB = '';
  aadhar = '';
  GuranterM = '';
  DLexpiry = '';
  LicenceNo = ''
  Gname = '';
  Dltype = '';
  photo = '';
  pan = '';
  bankName='';
  bankAccountNumber=null;
  bankIfscCode='';
  constructor(
    public activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    public renderer: Renderer2
  ) {
    console.log("---------", this.common.params.driverId)
    this.driverPersonalInfo();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close({ response: true });
  }


  driverPersonalInfo() {
    
    let params = "driverId=" + this.common.params.driverId
    console.log("=======", params)
    this.common.loading++;

    this.api.get('Drivers/getDriverPersonalInfo?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.driverInfo = res['data'];
        console.log('Res:', this.driverInfo);
        let driverinfodata=this.driverInfo[0];
        console.log("-------------------", this.name)
        this.name = driverinfodata.empname!=null?driverinfodata.empname:"---------------------";
        this.address = driverinfodata.address!=null?driverinfodata.address:"---------------------";
        this.pNumber = driverinfodata.mobileno!=null?driverinfodata.mobileno:"---------------------";
        this.DOB = driverinfodata.dob!=null?driverinfodata.dob:"---------------------";
        this.aadhar = driverinfodata.aadhar_no!=null?driverinfodata.aadhar_no:"---------------------";
        this.sNumber = driverinfodata.mobileno2!=null?driverinfodata.mobileno2:"---------------------";
        this.GuranterM = driverinfodata.guarantor_mobileno!=null?driverinfodata.guarantor_mobileno:"---------------------";
        this.DLexpiry = driverinfodata.dl_expiry!=null?driverinfodata.dl_expiry:"---------------------";
        this.LicenceNo = driverinfodata.licence_no!=null?driverinfodata.licence_no:"---------------------";
        this.Dltype = driverinfodata.licence_type!=null?driverinfodata.licence_type:"---------------------";
        this.photo = driverinfodata.photo != null ? driverinfodata.photo : this.staticImagePath;
        this.pan = driverinfodata.pan_no!=null?driverinfodata.pan_no:"---------------------";
        this.bankAccountNumber=driverinfodata.bank_acno!=null?driverinfodata.bank_acno:"---------------------";
        this.bankIfscCode=driverinfodata.ifsc_code!=null?driverinfodata.ifsc_code:"---------------------";
        this.bankName=driverinfodata.bank_name!=null?driverinfodata.bank_name:"---------------------";
        console.log("dataaaaaaaaaaaaa", this.driverInfo);
      })

  }

  printHandler() {
    this.renderer.addClass(document.body, 'test');
    let css = '@page { size: landscape !important; }';
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');

    style.type = 'text/css';
    style.media = 'print';

    if (style['styleSheet']) {
      style['styleSheet'].cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    window.print();
    let printWindowListener = setInterval(() => {
      if (document.readyState == "complete") {
        clearInterval(printWindowListener);
        head.removeChild(style);
        this.renderer.addClass(document.body, 'test');
      }
    }, 1000);
  }
}
