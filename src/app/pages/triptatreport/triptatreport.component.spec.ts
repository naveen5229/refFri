import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriptatreportComponent } from './triptatreport.component';

describe('TriptatreportComponent', () => {
  let component: TriptatreportComponent;
  let fixture: ComponentFixture<TriptatreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriptatreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriptatreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
