import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstParkingSitesDaysComponent } from './worst-parking-sites-days.component';

describe('WorstParkingSitesDaysComponent', () => {
  let component: WorstParkingSitesDaysComponent;
  let fixture: ComponentFixture<WorstParkingSitesDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstParkingSitesDaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstParkingSitesDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
