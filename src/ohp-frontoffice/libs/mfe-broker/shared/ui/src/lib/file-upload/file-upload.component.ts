import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GenericStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'cfo-file-upload',
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
  genericStatus = GenericStatus;
  files?: any[];

  @Input() showUpload?: boolean;
  @Input() isUploading?: boolean;
  @Input() stipulationId?: string | null;
  @Input() readOnlyMode = false;

  @Output() uploadFile = new EventEmitter<any>();

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor() {}

  clear() {
    this.fileUpload.clear();
  }

  onUploadFile(data: any) {
    this.files = data;
    this.uploadFile.emit({ id: this.stipulationId, content: data });
  }
}
