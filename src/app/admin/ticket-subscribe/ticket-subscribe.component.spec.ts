import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSubscribeComponent } from './ticket-subscribe.component';

describe('TicketSubscribeComponent', () => {
  let component: TicketSubscribeComponent;
  let fixture: ComponentFixture<TicketSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
