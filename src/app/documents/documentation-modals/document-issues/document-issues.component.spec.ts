import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentIssuesComponent } from './document-issues.component';

describe('DocumentIssuesComponent', () => {
  let component: DocumentIssuesComponent;
  let fixture: ComponentFixture<DocumentIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
