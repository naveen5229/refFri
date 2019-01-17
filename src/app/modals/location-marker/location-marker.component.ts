import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'location-marker',
  templateUrl: './location-marker.component.html',
  styleUrls: ['./location-marker.component.scss']
})
export class LocationMarkerComponent implements OnInit {
  
  kpi = null;

  constructor(public common: CommonService,
    private activeModal: NgbActiveModal) { 
    this.kpi = this.common.params.kpi;
  }
  
 

  ngOnInit() {
  }
  closeModal(){
    this.activeModal.close();
  }

}
