import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketVehFreightStatementComponent } from './market-veh-freight-statement.component';

describe('MarketVehFreightStatementComponent', () => {
  let component: MarketVehFreightStatementComponent;
  let fixture: ComponentFixture<MarketVehFreightStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketVehFreightStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketVehFreightStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
