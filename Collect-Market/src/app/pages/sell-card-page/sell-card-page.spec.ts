import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellCardPage } from './sell-card-page';

describe('SellCardPage', () => {
  let component: SellCardPage;
  let fixture: ComponentFixture<SellCardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellCardPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellCardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
