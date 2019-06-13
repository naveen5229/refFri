import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddViaRoutesComponent } from '../../modals/add-via-routes/add-via-routes.component';

@Component({
  selector: 'via-routes',
  templateUrl: './via-routes.component.html',
  styleUrls: ['./via-routes.component.scss', '../../pages/pages.component.css']
})
export class ViaRoutesComponent implements OnInit {
  foData = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { }

  ngOnInit() {
  }
  selectFoUser(user) {
    console.log("user", user);
    this.foData = user;
  }

  addViaRoutes() {
    if (!this.foData) {
      this.common.showError("Please select FoUser");
      return false;
    }
    this.common.params = { foData: this.foData };
    this.common.handleModalSize('class', 'modal-lg', '1150');

    const activeModal = this.modalService.open(AddViaRoutesComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // if (data.response) {
      // }
    });

  }

}
