import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgTrafficComponent } from './tmg-traffic.component';

describe('TmgTrafficComponent', () => {
  let component: TmgTrafficComponent;
  let fixture: ComponentFixture<TmgTrafficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmgTrafficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgTrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
