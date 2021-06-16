import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopWorkshopComponent } from './top-workshop.component';

describe('TopWorkshopComponent', () => {
  let component: TopWorkshopComponent;
  let fixture: ComponentFixture<TopWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopWorkshopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
