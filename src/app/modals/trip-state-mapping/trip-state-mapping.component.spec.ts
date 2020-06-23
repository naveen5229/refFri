import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripStateMappingComponent } from './trip-state-mapping.component';

describe('TripStateMappingComponent', () => {
  let component: TripStateMappingComponent;
  let fixture: ComponentFixture<TripStateMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripStateMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripStateMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
