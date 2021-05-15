import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGpsNewRequesComponent } from './add-gps-new-reques.component';

describe('AddGpsNewRequesComponent', () => {
  let component: AddGpsNewRequesComponent;
  let fixture: ComponentFixture<AddGpsNewRequesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGpsNewRequesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGpsNewRequesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
