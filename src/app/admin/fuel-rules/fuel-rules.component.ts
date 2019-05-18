import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFuelFullRuleComponent } from '../../modals/add-fuel-full-rule/add-fuel-full-rule.component';

@Component({
  selector: 'fuel-rules',
  templateUrl: './fuel-rules.component.html',
  styleUrls: ['./fuel-rules.component.scss']
})
export class FuelRulesComponent implements OnInit {

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {

  }

  ngOnInit() {
  }

  addFuelRule() {
    this.common.params = {};
    const activeModal = this.modalService.open(AddFuelFullRuleComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        // this.getSiteData();
      }
    });
  }

}
