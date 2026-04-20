import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarFormComponent } from './webinar-form.component';

describe('WebinarFormComponent', () => {
  let component: WebinarFormComponent;
  let fixture: ComponentFixture<WebinarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebinarFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebinarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
