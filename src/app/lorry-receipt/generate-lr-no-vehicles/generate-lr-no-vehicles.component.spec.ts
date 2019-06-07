import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLrNoVehiclesComponent } from './generate-lr-no-vehicles.component';

describe('GenerateLrNoVehiclesComponent', () => {
  let component: GenerateLrNoVehiclesComponent;
  let fixture: ComponentFixture<GenerateLrNoVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateLrNoVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateLrNoVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
