import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualItemsComponent } from './manual-items.component';

describe('ManualItemsComponent', () => {
  let component: ManualItemsComponent;
  let fixture: ComponentFixture<ManualItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
