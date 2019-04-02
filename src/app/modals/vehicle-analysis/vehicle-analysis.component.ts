import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'vehicle-analysis',
  templateUrl: './vehicle-analysis.component.html',
  styleUrls: ['./vehicle-analysis.component.scss','../../pages/pages.component.css']
})
export class VehicleAnalysisComponent implements OnInit {
data = [];
  constructor(public mapService: MapService,
    public common: CommonService,
    private activeModal: NgbActiveModal
  ) {
    this.data=this.common.params;
   }

  ngOnInit() {
  }
  
  closeModal() {
    this.activeModal.close();
  }

}
