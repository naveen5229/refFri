import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvGpsApisComponent } from './mv-gps-apis.component';

describe('MvGpsApisComponent', () => {
  let component: MvGpsApisComponent;
  let fixture: ComponentFixture<MvGpsApisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvGpsApisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvGpsApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
