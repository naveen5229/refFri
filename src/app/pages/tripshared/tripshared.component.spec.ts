import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsharedComponent } from './tripshared.component';

describe('TripsharedComponent', () => {
  let component: TripsharedComponent;
  let fixture: ComponentFixture<TripsharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
