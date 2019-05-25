import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelfillingsComponent } from './fuelfillings.component';

describe('FuelfillingsComponent', () => {
  let component: FuelfillingsComponent;
  let fixture: ComponentFixture<FuelfillingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelfillingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelfillingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
