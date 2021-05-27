import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlowestTransporterComponent } from './slowest-transporter.component';

describe('SlowestTransporterComponent', () => {
  let component: SlowestTransporterComponent;
  let fixture: ComponentFixture<SlowestTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlowestTransporterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlowestTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
