import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitProfileComponent } from './visit-profile.component';

describe('VisitProfileComponent', () => {
  let component: VisitProfileComponent;
  let fixture: ComponentFixture<VisitProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
