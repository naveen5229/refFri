import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import interact from 'interactjs';

@Component({
  selector: 'dynamic-report-dashboard',
  templateUrl: './dynamic-report-dashboard.component.html',
  styleUrls: ['./dynamic-report-dashboard.component.scss']
})
export class DynamicReportDashboardComponent implements OnInit {
  reports = [];

  constructor(private api: ApiService) {
    this.getSavedReports();
  }

  ngOnInit(): void {
  }

  getSavedReports() {
    this.api.get(`GraphicalReport/getGraphicalReportList`)
      .subscribe((res: any) => {
        console.log('Res:', res);
        this.reports = res.data.map(report => {
          report.isUsed = false;
          let style = {
            width: "300px",
            height: "300px",
            x: 0,
            y: 0,
          }
          report.style = style;
          return report;

        });
        setTimeout(() => this.jrxDragAndResize(), 1000);
      })
  }

  ngAfterViewInit() {

  }


  jrxDragAndResize() {
    interact('.draggable')
      .draggable({ onmove: this.jrxDragger.bind(this) })
      .resizable({
        preserveAspectRatio: true,
        edges: { left: true, right: true, bottom: true, top: true }
      })
      .on('resizemove', this.jrxResizer.bind(this));
  }



  jrxDragger(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  jrxResizer(event) {
    const target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0);
    let y = (parseFloat(target.getAttribute('data-y')) || 0);

    target.style.width = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

}
