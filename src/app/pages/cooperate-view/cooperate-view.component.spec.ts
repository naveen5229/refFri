import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperateViewComponent } from './cooperate-view.component';

describe('CooperateViewComponent', () => {
  let component: CooperateViewComponent;
  let fixture: ComponentFixture<CooperateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CooperateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
