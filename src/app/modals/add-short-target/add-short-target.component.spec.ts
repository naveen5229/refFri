import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShortTargetComponent } from './add-short-target.component';

describe('AddShortTargetComponent', () => {
  let component: AddShortTargetComponent;
  let fixture: ComponentFixture<AddShortTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShortTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShortTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
