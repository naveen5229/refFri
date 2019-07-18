import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFlagsComponent } from './entity-flags.component';

describe('EntityFlagsComponent', () => {
  let component: EntityFlagsComponent;
  let fixture: ComponentFixture<EntityFlagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityFlagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
