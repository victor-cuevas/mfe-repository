import { FormControlStatus } from '@angular/forms';

export interface DipProgressData {
  savedDips: {
    [key: number]: Record<string, FormControlStatus>;
  };
}
