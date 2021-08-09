import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampingComponent } from './stamping.component';

describe('StampingComponent', () => {
  let component: StampingComponent;
  let fixture: ComponentFixture<StampingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StampingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StampingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
