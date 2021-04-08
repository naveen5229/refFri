import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'placement-requirement',
  templateUrl: './placement-requirement.component.html',
  styleUrls: ['./placement-requirement.component.scss']
})
export class PlacementRequirementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
