import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRejectTripsComponent } from './open-reject-trips.component';

describe('OpenRejectTripsComponent', () => {
  let component: OpenRejectTripsComponent;
  let fixture: ComponentFixture<OpenRejectTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRejectTripsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenRejectTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
