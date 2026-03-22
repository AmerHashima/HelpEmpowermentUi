import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmpArticle2Component } from './pmp-article2.component';

describe('PmpArticle2Component', () => {
  let component: PmpArticle2Component;
  let fixture: ComponentFixture<PmpArticle2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmpArticle2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmpArticle2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
