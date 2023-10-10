import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { DialogData } from '../models/DialogData';

@Component({
  selector: 'cfo-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  @Input() data?: DialogData;
  @Input() showDialog? = false;
  @Input() width?: 'sm' | 'md' | 'lg' | 'xl' | null = null;
  @ContentChild('headerTemplate', { static: false })
  headerTemplateRef!: TemplateRef<any>;
  @ContentChild('contentTemplate', { static: false })
  contentTemplateRef!: TemplateRef<any>;
  @ContentChild('footerTemplate', { static: false })
  footerTemplateRef!: TemplateRef<any>;
  @Input() dataForTemplateHeader: any;
  @Input() dataForTemplateContent: any;
  @Input() dataForTemplateFooter: any;
}
