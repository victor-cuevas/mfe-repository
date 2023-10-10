import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export function removeStyleUrlsFrom(tokens: Type<any>[]): void {
  tokens.forEach(token => TestBed.overrideComponent(token, { set: { styleUrls: [] } }));
}
