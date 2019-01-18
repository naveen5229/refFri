import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTrailsComponent } from './ticket-trails.component';

describe('TicketTrailsComponent', () => {
  let component: TicketTrailsComponent;
  let fixture: ComponentFixture<TicketTrailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketTrailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTrailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
