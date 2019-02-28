import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ParticlularsComponent } from '../../modals/particlulars/particlulars.component';

@Component({
  selector: 'generate-lr',
  templateUrl: './generate-lr.component.html',
  styleUrls: ['./generate-lr.component.scss']
})
export class GenerateLRComponent implements OnInit {
materialDetails = null;
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,) { }

  ngOnInit() {
  }

  openParticularsModal(){
    console.log("open material modal")
    const activeModal = this.modalService.open(ParticlularsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      this.materialDetails = data.response;
    });
  }
}
