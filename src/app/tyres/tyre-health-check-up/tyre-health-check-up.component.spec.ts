import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreHealthCheckUpComponent } from './tyre-health-check-up.component';

describe('TyreHealthCheckUpComponent', () => {
  let component: TyreHealthCheckUpComponent;
  let fixture: ComponentFixture<TyreHealthCheckUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreHealthCheckUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreHealthCheckUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
