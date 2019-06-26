import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoFreightRatesComponent } from './fo-freight-rates.component';

describe('FoFreightRatesComponent', () => {
  let component: FoFreightRatesComponent;
  let fixture: ComponentFixture<FoFreightRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoFreightRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoFreightRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
