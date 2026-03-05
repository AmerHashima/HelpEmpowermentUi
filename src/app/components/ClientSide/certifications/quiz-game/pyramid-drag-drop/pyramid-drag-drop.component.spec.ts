import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidDragDropComponent } from './pyramid-drag-drop.component';

describe('PyramidDragDropComponent', () => {
  let component: PyramidDragDropComponent;
  let fixture: ComponentFixture<PyramidDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PyramidDragDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PyramidDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
