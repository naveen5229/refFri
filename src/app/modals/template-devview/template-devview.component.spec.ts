import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDevviewComponent } from './template-devview.component';

describe('TemplateDevviewComponent', () => {
  let component: TemplateDevviewComponent;
  let fixture: ComponentFixture<TemplateDevviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDevviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDevviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
