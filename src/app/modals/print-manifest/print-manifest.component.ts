import { Component, OnInit, NgZone, Renderer } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'print-manifest',
  templateUrl: './print-manifest.component.html',
  styleUrls: ['./print-manifest.component.scss', '../../pages/pages.component.css']
})
export class PrintManifestComponent implements OnInit {

  printDetails = {
    logo: 'Logo',
    companyName: 'Nikita Cargo Movers',
    challanNo: 264525,
    address: 'DLF Limited DLF Gateway Tower, R Block,DLF City Phase – III,Gurugram – 122002, Haryana Tel: +91-124-4396000',
    date: '20-05-2019',
    truckNo: 741454,
    from: 'jaipur',
    to: 'Kota',
    owner: 'Nikhil',
    ownerMobile: 9782945029,
    ownerPan: 'GCCIX451X',
    driver: 'Ajay',
    driverMobile: 9545458444,
    broker: 'Vijay',
    brokerMobile: 7845648545,


  }

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService,
    public datepipe: DatePipe,
    public renderer: Renderer
  ) { }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }

  print() {

  }



  onPrint() {
    this.renderer.setElementClass(document.body, 'test', true);
    window.print();
    this.renderer.setElementClass(document.body, 'test', false);


  }
}
