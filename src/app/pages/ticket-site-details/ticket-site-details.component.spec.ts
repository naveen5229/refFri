import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSiteDetailsComponent } from './ticket-site-details.component';

describe('TicketSiteDetailsComponent', () => {
  let component: TicketSiteDetailsComponent;
  let fixture: ComponentFixture<TicketSiteDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketSiteDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSiteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
