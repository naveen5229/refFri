import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';
import { SiteTripDetailsComponent } from '../../modals/site-trip-details/site-trip-details.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { UserService } from '../../services/user.service';

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
  table1 = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  dis_all = 0;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getPlacements();
    this.getVehiclePlacement();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }
  refresh() {

    this.getPlacements();
    this.getVehiclePlacement
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

  getTableColumns() {
    let columns = [];
    this.placements.map(placement => {
      let column = {
        siteName: { value: placement.r_sitename, action: this.siteTripModal.bind(this, placement, 'site') },
        onward: { value: placement.r_todayonwards, action: this.siteTripModal.bind(this, placement, 'onward') },
        loading: { value: placement.r_loadings, action: this.siteTripModal.bind(this, placement, 'loading') },
        towards: { value: placement.r_intransits, action: this.siteTripModal.bind(this, placement, 'towards') },
        waiting: { value: placement.r_waitingtime, },
      };

      columns.push(column);
    });
    return columns;
  }


  setTable() {
    let headings = {
      siteName: { title: 'Site Name', placeholder: 'Site Name' },
      onward: { title: 'Onward 24 Hrs', placeholder: 'Onward 24 Hrs' },
      loading: { title: 'At Loading', placeholder: 'At Loading' },
      towards: { title: 'Towards', placeholder: 'Towards' },
      waiting: { title: 'Waiting Time', placeholder: 'Waiting Time' },

    };
    return {
      placements: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      },
    }
  }

  getVehiclePlacement() {
    this.common.loading++;
    this.api.get('Placement/getFoPlacementRePort?')
      .subscribe(res => {
        this.common.loading--;
        this.vehiclePlacements = res['data'];
        console.log("vehicle placement", this.vehiclePlacements);
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
        if (element._placementid > 0)
          this.filteredVehiclePlacements.push(element);
      });
    }
    else if (displayType == -1) {
      this.filteredVehiclePlacements = [];
      this.vehiclePlacements.forEach((element) => {
        if (element._placementid <= 0)
          this.filteredVehiclePlacements.push(element);
      });
    }
    else {
      this.filteredVehiclePlacements = [];
      this.filteredVehiclePlacements = this.vehiclePlacements;
    }
    this.smartTableWithHeadings();

  }

  headings = [];
  showTable = false;
  valobj = null;

  smartTableWithHeadings() {
    console.log("smart table with heading");
    this.table1 = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    if (this.filteredVehiclePlacements != null) {
      console.log('filteredVehiclePlacements', this.filteredVehiclePlacements);
      let first_rec = this.filteredVehiclePlacements[0];
      console.log("first_Rec", first_rec);

      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          this.headings.push(key);
          let headerObj = { title: key, placeholder: this.formatTitle(key) };
          if (key == 'Trip Start')
            headerObj['type'] = 'date';
          this.table1.data.headings[key] = headerObj;
        }

      }

      this.table1.data.columns = this.getTableColumns2();
      console.log("table:");
      console.log(this.table1);
      this.showTable = true;
    } else {
      this.common.showToast('No Record Found !!');
    }


  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getTableColumns2() {
    let columns = [];
    for (var i = 0; i < this.filteredVehiclePlacements.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (this.headings[j] == "Trip") {
          console.log("htmll------", this.common.getJSONTripStatusHTML(this.filteredVehiclePlacements[i]));
          this.valobj[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.filteredVehiclePlacements[i]), isHTML: true, class: 'black', action: '' };

        }
        else if (this.headings[j] == "Action") {
          this.valobj[this.headings[j]] = this.user.permission.edit && { value: `<i class="fa fa-pencil-alt"></i>`, isHTML: true, action: this.openPlacementModal.bind(this, this.filteredVehiclePlacements[i]), class: 'icon text-center del' };
        } else if (this.headings[j] == "Current Loc") {
          this.valobj[this.headings[j]] = { value: this.filteredVehiclePlacements[i][this.headings[j]], class: 'black', action: this.showLocation.bind(this, this.filteredVehiclePlacements[i]) };

        }
        else {
          this.valobj[this.headings[j]] = { value: this.filteredVehiclePlacements[i][this.headings[j]], class: 'black', action: '' };

        }
      }
      this.valobj['style'] = { background: this.filteredVehiclePlacements[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }





  // setTable1() {
  //   console.log("filtered data === ", this.filteredVehiclePlacements);
  //   let headings1 = {
  //     regno: { title: 'Vehicle No', placeholder: 'Vehicle No' },
  //     source: { title: 'Source', placeholder: 'Source' },
  //     destination: { title: 'Destination', placeholder: 'Destination' },
  //     status: { title: 'Status', placeholder: 'Status' },
  //     placement: { title: 'Placements', placeholder: 'Placements' },
  //     action: { title: 'Action', placeholder: 'Action' },

  //   };
  //   return {
  //     filteredVehiclePlacements: {
  //       headings: headings1,
  //       columns: this.getTableColumns1()
  //     },
  //     settings1: {
  //       hideHeader: true,
  //       tableHeight: "auto"
  //     },
  //   }
  // }

  // getTableColumns1() {
  //   let columns1 = [];
  //   this.filteredVehiclePlacements.map(vehiclePlacement => {
  //     let column1 = {
  //       regno: { value: vehiclePlacement.r_regno },
  //       source: { value: vehiclePlacement.r_source },
  //       destination: { value: vehiclePlacement.r_destination },
  //       status: { value: vehiclePlacement.r_status },
  //       placement: { value: vehiclePlacement.r_placement_name },
  //       action: { value: `<i class="fa fa-pencil-alt"></i>`, isHTML: true, action: this.openPlacementModal.bind(this, vehiclePlacement), class: 'icon text-center del' },
  //     };

  //     columns1.push(column1);
  //   });
  //   return columns1;
  // }

  openPlacementModal(placement) {
    console.log("openPlacementModal", placement);
    let tripDetails = {
      vehicleId: placement._vid,
      siteId: placement._site_id
    }
    this.common.params = { tripDetils: tripDetails, ref_page: 'placements' };
    console.log("vehicleTrip", tripDetails);
    const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      //console.log("data", data.respone);
      this.getVehiclePlacement();

    });
  }

  siteTripModal(placement, status) {
    console.log("siteTripModal", placement);
    let dataForView = {
      userId: placement.r_uid,
      siteId: placement.r_siteid,
      status: status == 'site' ? 'null' : status,
    };
    this.common.params = { dataForView: dataForView, ref_page: 'placements' };
    console.log("dataForView", dataForView);
    const activeModal = this.modalService.open(SiteTripDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      //console.log("data", data.respone);
      // this.getVehiclePlacement();

    });
  }
  showLocation(kpi) {
    if (!kpi._tlat) {
      this.common.showToast("Vehicle location not available!");
      return;
    }
    const location = {
      lat: kpi._tlat,
      lng: kpi._tlong,
      name: "",
      time: ""
    };
    ////console.log("Location: ", location);
    this.common.params = { location, title: "Vehicle Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, {
      size: "lg",
      container: "nb-layout"
    });
  }
}


