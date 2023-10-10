import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private isLoading = false;
  private text?: string;
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setIsLoading(value: boolean, text?: string) {
    this.isLoading = value;
    this.text = text;
    value ? this.renderer.addClass(document.body, 'overflow-hidden') : this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }

  getText(): string | undefined {
    return this.text;
  }
}
