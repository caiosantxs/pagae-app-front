import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hangouts } from './hangouts';

describe('Hangouts', () => {
  let component: Hangouts;
  let fixture: ComponentFixture<Hangouts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hangouts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hangouts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
