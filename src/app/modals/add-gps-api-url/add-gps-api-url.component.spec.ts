import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGpsApiUrlComponent } from './add-gps-api-url.component';

describe('AddGpsApiUrlComponent', () => {
  let component: AddGpsApiUrlComponent;
  let fixture: ComponentFixture<AddGpsApiUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGpsApiUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGpsApiUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
