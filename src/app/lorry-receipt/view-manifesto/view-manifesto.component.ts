import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { PrintManifestComponent } from '../../modals/print-manifest/print-manifest.component';
import { GenerateLrMainfestoComponent } from '../generate-lr-mainfesto/generate-lr-mainfesto.component';

@Component({
  selector: 'view-manifesto',
  templateUrl: './view-manifesto.component.html',
  styleUrls: ['./view-manifesto.component.scss']
})
export class ViewManifestoComponent implements OnInit {
  startDate = '';
  endDate = '';
  manifestData = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: '75vh'
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    let today = new Date();
    this.endDate = (this.common.dateFormatter(today)).split(' ')[0];
    this.startDate = (this.common.dateFormatter(new Date(today.setDate(today.getDate() - 10)))).split(' ')[0];
    this.common.refresh = this.refresh.bind(this);
    this.getLrManifest();


  }

  ngOnInit() {
  }

  refresh() {
    this.getLrManifest();
  }

  getDate(type) {
    this.common.params = { ref_page: 'vehicle trip stages' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.startDate);
        }
        else {
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });
  }


  getLrManifest() {
    this.manifestData = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        tableHeight: '75vh',
      }
    };
    let endDate = this.common.dateFormatter1(this.endDate.split(' ')[0]) + " 23:59:00"
    let params = "startDate=" + this.common.dateFormatter1(this.startDate).split(' ')[0] +
      "&endDate=" + endDate;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getLrManifest?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.manifestData = res['data'];
        console.log("retrun Data length is zero", this.manifestData);
        if (this.manifestData == null) {
          return;

        }

        let first_rec = this.manifestData[0];

        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }

        }
        let action = { title: 'Action', placeholder: 'Action' };
        this.table.data.headings['action'] = action;
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getTableColumns() {
    let columns = [];
    let State
    for (var i = 0; i < this.manifestData.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {

        this.valobj[this.headings[j]] = { value: this.manifestData[i][this.headings[j]], class: (this.manifestData[i][this.headings[j]] > 0) ? 'blue' : 'black', action: '' };
        this.valobj['action'] = {
          value: '', isHTML: false, action: null, icons: [
            { class: 'fa fa-print', action: this.openViewManifestModal.bind(this, this.manifestData[i]) },
            { class: " fa fa-pencil-square-o ml-2", action: this.editLrManifest.bind(this, this.manifestData[i]) }
          ]
          //value: `<span>view</span>`, isHTML: true, class: 'zoom', action: this.openViewManifestModal.bind(this, this.manifestData[i])
        }
      }
      columns.push(this.valobj);
    }
    return columns;
  }





  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  openViewManifestModal(manifestData) {
    console.log("====manifestData=", manifestData);
    this.common.params = { manifestId: manifestData._id };
    const activeModal = this.modalService.open(PrintManifestComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' })
    activeModal.result.then(data => {
    })
  }

  editLrManifest(manifestData) {
    this.common.params = { manifestId: manifestData._id };
    const activeModal = this.modalService.open(GenerateLrMainfestoComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
    activeModal.result.then(data => {
      this.getLrManifest();
    })
  }


  genrateLrManifest() {
    this.common.params = {};
    const activeModal = this.modalService.open(GenerateLrMainfestoComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
    activeModal.result.then(data => {
      this.getLrManifest();
    })
  }
}
