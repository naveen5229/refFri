import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstTransporterMonthsComponent } from './worst-transporter-months.component';

describe('WorstTransporterMonthsComponent', () => {
  let component: WorstTransporterMonthsComponent;
  let fixture: ComponentFixture<WorstTransporterMonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstTransporterMonthsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstTransporterMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
