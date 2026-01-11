import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  afterNextRender,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  inputVariants,
  type ZardInputSizeVariants,
  type ZardInputStatusVariants,
  type ZardInputTypeVariants,
} from './input.variants';

import { mergeClasses, transform } from '@shared/utils/merge-classes';

@Directive({
  selector: 'input[z-input], textarea[z-input]',
  host: {
    '[class]': 'classes()',
    '(input)': 'updateValue($event.target)',
  },
  exportAs: 'zInput',
})
export class ZardInputDirective {
  private readonly elementRef = inject(ElementRef);
  private isInitialized = false;

  readonly class = input<ClassValue>('');
  readonly zBorderless = input(false, { transform });
  readonly zSize = input<ZardInputSizeVariants>('default');
  readonly zStatus = input<ZardInputStatusVariants>();
  readonly value = model<string>('');

  readonly size = linkedSignal<ZardInputSizeVariants>(() => this.zSize());

  protected readonly classes = computed(() =>
    mergeClasses(
      inputVariants({
        zType: this.getType(),
        zSize: this.size(),
        zStatus: this.zStatus(),
        zBorderless: this.zBorderless(),
      }),
      this.class(),
    ),
  );

  constructor() {
    // Mark as initialized after first render to allow form controls to set initial values
    afterNextRender(() => {
      this.isInitialized = true;
    });

    effect(() => {
      const value = this.value();
      const nativeElement = this.elementRef.nativeElement;
      const nativeValue = nativeElement.value;

      // Only update native element if value signal is set and differs from native value
      if (value !== undefined && value !== null && value !== nativeValue) {
        // Don't overwrite form control values with empty string during initialization
        if (!this.isInitialized && value === '' && nativeValue !== '') {
          return;
        }
        nativeElement.value = value;
      }
    });
  }

  disable(b: boolean): void {
    this.elementRef.nativeElement.disabled = b;
  }

  setDataSlot(name: string): void {
    if (this.elementRef?.nativeElement?.dataset) {
      this.elementRef.nativeElement.dataset.slot = name;
    }
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as HTMLInputElement | HTMLTextAreaElement | null;
    this.value.set(el?.value ?? '');
  }

  getType(): ZardInputTypeVariants {
    const isTextarea = this.elementRef.nativeElement.tagName.toLowerCase() === 'textarea';
    return isTextarea ? 'textarea' : 'default';
  }
}
