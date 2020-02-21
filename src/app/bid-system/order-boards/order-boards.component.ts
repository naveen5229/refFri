import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'order-boards',
  templateUrl: './order-boards.component.html',
  styleUrls: ['./order-boards.component.scss']
})
export class OrderBoardsComponent implements OnInit {
  orders= [{ hours:"3 hrs",orders:"600",bids:"375 (54 %)",bids_avg:"45",placement:"300"},
  { hours:"6 hrs",orders:"1200",bids:"1175 (56 %)",bids_avg:"56",placement:"930"},
  { hours:"12 hrs",orders:"2435",bids:"2075 (65 %)",bids_avg:"75",placement:"1258"},
  { hours:"24 hrs",orders:"4658",bids:"4258 (77 %)",bids_avg:"84",placement:"3687"},
  { hours:"24-48 hrs",orders:"9875",bids:"8568 (64 %)",bids_avg:"91",placement:"7865"}];
  constructor() { }

  ngOnInit() {
  }

}
