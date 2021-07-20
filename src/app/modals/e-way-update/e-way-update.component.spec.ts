import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWayUpdateComponent } from './e-way-update.component';

describe('EWayUpdateComponent', () => {
  let component: EWayUpdateComponent;
  let fixture: ComponentFixture<EWayUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EWayUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EWayUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
