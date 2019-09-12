import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvsFreightStatementComponent } from './mvs-freight-statement.component';

describe('MvsFreightStatementComponent', () => {
  let component: MvsFreightStatementComponent;
  let fixture: ComponentFixture<MvsFreightStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvsFreightStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvsFreightStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
