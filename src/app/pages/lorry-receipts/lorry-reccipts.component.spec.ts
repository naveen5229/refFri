import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryRecciptsComponent } from './lorry-reccipts.component';

describe('LorryRecciptsComponent', () => {
  let component: LorryRecciptsComponent;
  let fixture: ComponentFixture<LorryRecciptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LorryRecciptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LorryRecciptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
