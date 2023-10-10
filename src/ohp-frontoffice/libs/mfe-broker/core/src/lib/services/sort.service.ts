import { Injectable } from '@angular/core';

export interface SortItem {
  value: 'Ascending' | 'Descending';
  icon: 'pi-sort-down' | 'pi-sort-up';
}

@Injectable({
  providedIn: 'root',
})
export class SortService {
  sortValues: SortItem[] = [
    { value: 'Ascending', icon: 'pi-sort-down' },
    { value: 'Descending', icon: 'pi-sort-up' },
  ];

  /**
   * Returns the sortItem, which includes the value and the icon property.
   * If an argument (sortItem) is provided, it returns the opposite value, if
   * no argument is provided it returns the default Ascending sortItem
   *
   * @param sortItem
   */
  getSortOrder(sortItem?: SortItem) {
    if (sortItem) {
      return sortItem.value === 'Ascending' ? this.sortValues[1] : this.sortValues[0];
    } else {
      return this.sortValues[0];
    }
  }

  sortArrayByLabel(aLabel: string, bLabel: string) {
    if (aLabel && bLabel) {
      if (aLabel < bLabel) {
        return -1;
      }
      if (aLabel > bLabel) {
        return 1;
      }
    }
    return 0;
  }
}
