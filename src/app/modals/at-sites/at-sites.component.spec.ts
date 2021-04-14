import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtSitesComponent } from './at-sites.component';

describe('AtSitesComponent', () => {
  let component: AtSitesComponent;
  let fixture: ComponentFixture<AtSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
