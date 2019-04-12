import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';

@Component({
  selector: 'placements-dash-board',
  templateUrl: './placements-dash-board.component.html',
  styleUrls: ['./placements-dash-board.component.scss', '../pages.component.css']
})
export class PlacementsDashBoardComponent implements OnInit {
  placements = [];
  vehiclePlacements = [];
  filteredVehiclePlacements = [];
  table = null;
  table1 = null;
  dis_all=0;
  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.getPlacements();
    this.getVehiclePlacement();
  }

  ngOnInit() {
  }

  getPlacements() {
    console.log("api hit");
    this.common.loading++;
    this.api.get('Placement/getFOAdminPlacementRePort')
      .subscribe(res => {
        this.common.loading--;
        console.log("data====", res['data']);
        this.placements = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  getVehiclePlacement() {
    this.common.loading++;
    this.api.get('Placement/getFoPlacementRePort?')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.vehiclePlacements = res['data'];
        this.displayList(0);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  displayList(displayType) {
    console.log("display Type=", displayType, "vehiclePlacements=", this.vehiclePlacements);

    if (displayType == 1) {
      this.filteredVehiclePlacements = [];
      this.vehiclePlacements.forEach((element) => {
        if (element.r_placement_id > 0)
          this.filteredVehiclePlacements.push(element);
      });
    }
    else if (displayType == -1) {
      this.filteredVehiclePlacements = [];
      this.vehiclePlacements.forEach((element) => {
        if (element.r_placement_id <= 0)
          this.filteredVehiclePlacements.push(element);
      });
    }
    else {
      this.filteredVehiclePlacements = [];
      this.filteredVehiclePlacements = this.vehiclePlacements;
    }
    this.table1 = this.setTable1();

  }
  openPlacementModal(placement) {
    console.log("openPlacementModal", placement);
    let tripDetails = {
      id: placement.r_trip_id,
      // endName : placement.x_showtripend,
      startName: placement.r_source,
      startTime: placement.r_showstarttime,
      //endTime : placement.x_showendtime,
      regno: placement.r_regno,
      vehicleId: placement.r_vid,
      siteId: placement.r_hl_site_id

    }
    this.common.params = { tripDetils: tripDetails, ref_page: 'placements' };
    console.log("vehicleTrip", tripDetails);
    const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      //console.log("data", data.respone);
      this.getVehiclePlacement();

    });
  }



  setTable() {
    let headings = {
      siteName: { title: 'Site Name', placeholder: 'Site Name' },
      onward: { title: 'Omnward', placeholder: 'Onward' },
      loading: { title: 'At Loading', placeholder: 'At Loading' },
      intrasit: { title: 'At Intransit', placeholder: 'At Intrasit' },
      waiting: { title: 'Waiting Time', placeholder: 'Waiting Time' },

    };
    return {
      placements: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "76vh"
      },
    }
  }

  getTableColumns() {
    let columns = [];
    this.placements.map(placement => {
      let column = {
        siteName: { value: placement.r_sitename },
        onward: { value: placement.r_todayonwards },
        loading: { value: placement.r_loadings },
        intrasit: { value: placement.r_intransits },
        waiting: { value: placement.r_waitingtime },
      };

      columns.push(column);
    });
    return columns;
  }


  setTable1() {
    console.log("filtered data === ",this.filteredVehiclePlacements);
    let headings1 = {
      regno: { title: 'Vehicle No', placeholder: 'Vehicle No' },
      source: { title: 'Source', placeholder: 'Source' },
      destination: { title: 'Destination', placeholder: 'Destination' },
      status: { title: 'Status', placeholder: 'Status' },
      placement: { title: 'Placements', placeholder: 'Placements' },
       action: { title: 'Action', placeholder: 'Action' },

    };
    return {
      filteredVehiclePlacements: {
        headings: headings1,
        columns: this.getTableColumns1()
      },
      settings1: {
        hideHeader: true,
        tableHeight: "76vh"
      },
    }
  }

  getTableColumns1() {
    let columns1 = [];
    this.filteredVehiclePlacements.map(vehiclePlacement => {
      let column1 = {
        regno: { value: vehiclePlacement.r_regno },
        source: { value: vehiclePlacement.r_source },
        destination: { value: vehiclePlacement.r_destination },
        status: { value: vehiclePlacement.r_status },
        placement: { value: vehiclePlacement.r_placement_name },
         action: { value: `<i class="fa fa-pencil-alt"></i>`, isHTML: true, action: this.openPlacementModal.bind(this, vehiclePlacement), class: 'icon text-center del' },

      };

      columns1.push(column1);
    });
    return columns1;
  }
}


