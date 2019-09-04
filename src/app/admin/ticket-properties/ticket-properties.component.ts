import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateTicketPropertiesComponent } from '../../modals/update-ticket-properties/update-ticket-properties.component'


@Component({
  selector: 'ticket-properties',
  templateUrl: './ticket-properties.component.html',
  styleUrls: ['./ticket-properties.component.scss', '../../pages/pages.component.css']
})
export class TicketPropertiesComponent implements OnInit {

  ticketProperties = [];
  checkFlag = false;
  foid = '';

  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
      this.common.refresh = this.refresh.bind(this);
     }

  ngOnInit() {
  }

  refresh(){
    console.log('refresh');
  }

  getSuggestions(suggestionList) {

    this.foid = suggestionList.id;
    let params = {
      foid: suggestionList.id
    };
    this.common.loading++;
    this.api.post('FoTicketProperties/getFoProperties', params)
      .subscribe(res => {
        this.common.loading--;
        this.ticketProperties = res['data'];
        console.log('res: ' + res['data'].foid);
        console.log('ticketProperties: ' + this.ticketProperties);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  openUpdatePropertiesModel(values, flag) {
    let foid = this.foid;
    this.common.params = { values, flag, foid };
    const activeModel = this.modalService.open(UpdateTicketPropertiesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModel.result.then(data => {

    });
  }

}
