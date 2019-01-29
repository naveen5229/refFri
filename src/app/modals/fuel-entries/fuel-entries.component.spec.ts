import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEntriesComponent } from './fuel-entries.component';

describe('FuelEntriesComponent', () => {
  let component: FuelEntriesComponent;
  let fixture: ComponentFixture<FuelEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
