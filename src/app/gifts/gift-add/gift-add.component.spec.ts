import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftAddComponent } from './gift-add.component';

describe('GiftAddComponent', () => {
  let component: GiftAddComponent;
  let fixture: ComponentFixture<GiftAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiftAddComponent]
    });
    fixture = TestBed.createComponent(GiftAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
