import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripdeliverycomplinancereportComponent } from './tripdeliverycomplinancereport.component';

describe('TripdeliverycomplinancereportComponent', () => {
  let component: TripdeliverycomplinancereportComponent;
  let fixture: ComponentFixture<TripdeliverycomplinancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripdeliverycomplinancereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripdeliverycomplinancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
