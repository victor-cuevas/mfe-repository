import { Directive, Host, HostListener, Input, Self } from '@angular/core';
import { Calendar } from 'primeng/calendar';

@Directive({
  selector: '[cfcCalendar]'
})
export class FluidCalendarDirective {
  @Input() AdditionalDateFormats: Array<string> = ['dd-mm-yy', 'ddmmyy', 'dd/mm/yyyy'];

  constructor(@Host() @Self() public calendar: Calendar) {
    this.SupportAdditionalDateFormats();
  }

  @HostListener('onSelect', ['$event']) onSelect() {
    this.toUtc();
  }

  @HostListener('onInput', ['$event']) oninput() {
    this.toUtc();
  }

  private toUtc() {
    if (this.calendar.value) {
      this.calendar.value = new Date(
        Date.UTC(this.calendar.value.getFullYear(), this.calendar.value.getMonth(), this.calendar.value.getDate(), 0, 0, 0)
      );
      this.calendar.updateModel(this.calendar.value);
    }
  }

  SupportAdditionalDateFormats() {
    this.calendar.parseDateTime = (text): any => {
      let date!: Date | null;
      const parts: string[] = text.split(' ');
      let message = '';
      if (this.calendar.timeOnly) {
        date = new Date();
        this.calendar.populateTime(date, parts[0], parts[1]);
      } else {
        let dateFormatList = [];
        dateFormatList.push(this.calendar.getDateFormat());
        dateFormatList = dateFormatList.concat(this.AdditionalDateFormats);
        for (const format of dateFormatList) {
          try {
            if (this.calendar.showTime) {
              const ampm = this.calendar.hourFormat == '12' ? parts.pop() : null;
              const timeString = parts.pop();

              date = this.calendar.parseDate(parts.join(' '), format);
              this.calendar.populateTime(date, timeString, ampm);
            } else {
              date = this.calendar.parseDate(text, format);
            }
          } catch (err: any) {
            date = null;
            message = err;
          }
          if (date) {
            break;
          }
        }
        const minMaxYears = this.calendar.yearRange.split(':', 2);

        if (date && minMaxYears && minMaxYears.length == 2) {
          const year = date.getFullYear();
          const minYear = parseInt(minMaxYears[0]);
          const maxYear = parseInt(minMaxYears[1]);
          if (year < minYear || year > maxYear) {
            date = null;
            message = 'year is not in valid range '.concat(minMaxYears[0]).concat(' and ').concat(minMaxYears[1]);
          }
        }
        if (!date) {
          throw message;
        }
        return date;
      }
    };
  }
}
