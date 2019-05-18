import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMappingComponent } from './card-mapping.component';

describe('CardMappingComponent', () => {
  let component: CardMappingComponent;
  let fixture: ComponentFixture<CardMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
