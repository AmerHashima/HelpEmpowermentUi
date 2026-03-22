import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmpArticle1Component } from './pmp-article1.component';

describe('PmpArticle1Component', () => {
  let component: PmpArticle1Component;
  let fixture: ComponentFixture<PmpArticle1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmpArticle1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmpArticle1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
