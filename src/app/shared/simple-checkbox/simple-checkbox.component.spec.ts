import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCheckboxComponent } from './simple-checkbox.component';

describe('SimpleCheckboxComponent', () => {
  let component: SimpleCheckboxComponent;
  let fixture: ComponentFixture<SimpleCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
