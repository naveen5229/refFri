import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTripDetailComponent } from './update-trip-detail.component';

describe('UpdateTripDetailComponent', () => {
  let component: UpdateTripDetailComponent;
  let fixture: ComponentFixture<UpdateTripDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTripDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
