import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGpsWebUrlComponent } from './add-gps-web-url.component';

describe('AddGpsWebUrlComponent', () => {
  let component: AddGpsWebUrlComponent;
  let fixture: ComponentFixture<AddGpsWebUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGpsWebUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGpsWebUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
