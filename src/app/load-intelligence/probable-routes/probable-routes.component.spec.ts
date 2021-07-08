import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbableRoutesComponent } from './probable-routes.component';

describe('ProbableRoutesComponent', () => {
  let component: ProbableRoutesComponent;
  let fixture: ComponentFixture<ProbableRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbableRoutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbableRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
