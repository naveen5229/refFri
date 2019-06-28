import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTrafficKpisComponent } from './routes-traffic-kpis.component';

describe('RoutesTrafficKpisComponent', () => {
  let component: RoutesTrafficKpisComponent;
  let fixture: ComponentFixture<RoutesTrafficKpisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesTrafficKpisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesTrafficKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
