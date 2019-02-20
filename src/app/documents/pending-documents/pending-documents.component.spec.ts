import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDocumentsComponent } from './pending-documents.component';

describe('PendingDocumentsComponent', () => {
  let component: PendingDocumentsComponent;
  let fixture: ComponentFixture<PendingDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
