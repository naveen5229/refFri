import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsKpiComponent } from './tickets-kpi.component';

describe('TicketsKpiComponent', () => {
  let component: TicketsKpiComponent;
  let fixture: ComponentFixture<TicketsKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
