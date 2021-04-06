import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripstoppageComponent } from './tripstoppage.component';

describe('TripstoppageComponent', () => {
  let component: TripstoppageComponent;
  let fixture: ComponentFixture<TripstoppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripstoppageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripstoppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
