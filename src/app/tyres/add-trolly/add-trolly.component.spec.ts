import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrollyComponent } from './add-trolly.component';

describe('AddTrollyComponent', () => {
  let component: AddTrollyComponent;
  let fixture: ComponentFixture<AddTrollyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrollyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrollyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
