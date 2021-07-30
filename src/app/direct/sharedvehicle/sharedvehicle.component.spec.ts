import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedvehicleComponent } from './sharedvehicle.component';

describe('SharedvehicleComponent', () => {
  let component: SharedvehicleComponent;
  let fixture: ComponentFixture<SharedvehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedvehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedvehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
