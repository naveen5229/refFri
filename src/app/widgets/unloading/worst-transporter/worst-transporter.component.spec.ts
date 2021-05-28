import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstTransporterComponent } from './worst-transporter.component';

describe('WorstTransporterComponent', () => {
  let component: WorstTransporterComponent;
  let fixture: ComponentFixture<WorstTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstTransporterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
