import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCardsPage } from './my-cards-page';

describe('MyCardsPage', () => {
  let component: MyCardsPage;
  let fixture: ComponentFixture<MyCardsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCardsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCardsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
