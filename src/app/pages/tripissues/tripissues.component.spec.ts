import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripissuesComponent } from './tripissues.component';

describe('TripissuesComponent', () => {
  let component: TripissuesComponent;
  let fixture: ComponentFixture<TripissuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripissuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
