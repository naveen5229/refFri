import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstParkingSitesComponent } from './worst-parking-sites.component';

describe('WorstParkingSitesComponent', () => {
  let component: WorstParkingSitesComponent;
  let fixture: ComponentFixture<WorstParkingSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstParkingSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstParkingSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
