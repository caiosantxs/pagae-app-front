import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangoutCreator } from './hangout-creator';

describe('HangoutCreator', () => {
  let component: HangoutCreator;
  let fixture: ComponentFixture<HangoutCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangoutCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangoutCreator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
