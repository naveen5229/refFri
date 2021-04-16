import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'dynamic-report-dashboard',
  templateUrl: './dynamic-report-dashboard.component.html',
  styleUrls: ['./dynamic-report-dashboard.component.scss']
})
export class DynamicReportDashboardComponent implements OnInit {
  reportName = '';
  draggedEle = null;
  freeCanvas: any = null;
  dataHolderContainer = [
    { text: 'test-1', x: 100, y: 200, width: 50, height: 300 },
    { text: 'test-2', x: 150, y: 200, width: 50, height: 50 },
    { text: 'test-3', x: 200, y: 200, width: 50, height: 50 },
    { text: 'test-4', x: 250, y: 200, width: 50, height: 50 },
    { text: 'test-5', x: 300, y: 200, width: 50, height: 50 }
  ];

  dataDrawContainer = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.freeCanvas = new fabric.Canvas('c', { selection: false });
    var canvasContainer = document.getElementById("canvas-container");
    console.log("for width height", canvasContainer)
    this.freeCanvas.setHeight(canvasContainer.clientHeight);
    this.freeCanvas.setWidth(canvasContainer.clientWidth);
    setTimeout(() => this.handleEvents(), 2000);
    this.drawFree();
  }

  drawFree() {
    this.freeCanvas.on("object:modified", (e) => {
      console.log("modified", e);
      this.manageText(e);
    });
  }

  manageText(updatePointer) {
    var targetCanvas = updatePointer.target;
    if (this.dataDrawContainer.length && targetCanvas) {
      this.dataDrawContainer.forEach(ele => {
        if (ele.x === targetCanvas.data.x && ele.y === targetCanvas.data.y) {
          ele.x = targetCanvas.left;
          ele.y = targetCanvas.top;
          ele.width = (targetCanvas.scaleX) ? (Math.abs(ele.width * targetCanvas.scaleX)) : ele.width;
          ele.height = (targetCanvas.scaleY) ? (Math.abs(ele.height * targetCanvas.scaleY)) : ele.height;
        }
      })
    }
    console.log('dataDrawContainer Edited', this.dataDrawContainer);
    this.drawCanwas();
  }

  drawCanwas() {
    console.log('data in draw canvas',this.dataDrawContainer)
    this.freeCanvas.clear();
    if (this.dataDrawContainer.length > 0) {
      this.dataDrawContainer.map(content => {
        var textbox = new fabric.Textbox(content.text, {
          height: content.height,
          width: content.width,
          originX: 'center',
          originY: 'center',
          // editable: true,
          selectable: true,
          top: content.y,
          left: content.x,
          fontSize: 16,
          textAlign: 'center',
          backgroundColor: 'lightgray',
          data: content,
        });
        this.freeCanvas.add(textbox);
      });
    }
  }

  dragstart(i) {
    this.draggedEle = i;
  }

  handleEvents() {
    var canvasContainer = document.getElementById("canvas-container");
    canvasContainer.addEventListener("drop", this.dragEndEle.bind(this), false);
  }

  dragEndEle(event) {
    console.log("event", this.draggedEle);
    var data = null;
    data = JSON.parse(JSON.stringify(this.dataHolderContainer[this.draggedEle]));
    console.log('dragend', event, data);
    data.x = event.layerX;
    data.y = event.layerY
    this.dataDrawContainer.push(data);
    console.log('data inserted', this.dataDrawContainer);
    this.drawCanwas()
  }

}
