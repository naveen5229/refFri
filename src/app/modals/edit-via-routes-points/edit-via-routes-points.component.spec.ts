import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViaRoutesPointsComponent } from './edit-via-routes-points.component';

describe('EditViaRoutesPointsComponent', () => {
  let component: EditViaRoutesPointsComponent;
  let fixture: ComponentFixture<EditViaRoutesPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditViaRoutesPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViaRoutesPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
