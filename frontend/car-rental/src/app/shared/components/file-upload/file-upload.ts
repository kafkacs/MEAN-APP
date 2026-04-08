import { SlicePipe } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicObjectI } from '../../interfaces/dynamic-object.interface';
import { FileUploadConfigI } from './interfaces/file-upload-config.interface';
import {
  MAX_IMAGE_FILE_SIZE_IN_BYTES,
  MAX_VIDEO_FILE_SIZE_IN_BYTES,
  MAX_DOCUMENT_FILE_SIZE_IN_BYTES,
  MAX_VOICE_FILE_SIZE_IN_BYTES,
  ALLOWED_IMAGE_FORMATS,
  ALLOWED_VIDEO_FORMATS,
  ALLOWED_DOCUMENT_FORMATS,
} from '../../constants/validations.constant';

@Component({
  selector: 'app-file-upload',
  imports: [TranslateModule, SlicePipe],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  @Output() filesDropped = new EventEmitter<FileList>();

  files: any[] = [];
  config = input.required<FileUploadConfigI>();
  validFileFormats: string = '';
  formats: DynamicObjectI = {
    MAX_IMAGE_FILE_SIZE_IN_BYTES: MAX_IMAGE_FILE_SIZE_IN_BYTES,
    MAX_VIDEO_FILE_SIZE_IN_BYTES: MAX_VIDEO_FILE_SIZE_IN_BYTES,
    MAX_DOCUMENT_FILE_SIZE_IN_BYTES: MAX_DOCUMENT_FILE_SIZE_IN_BYTES,
    MAX_VOICE_FILE_SIZE_IN_BYTES: MAX_VOICE_FILE_SIZE_IN_BYTES,

    ALLOWED_IMAGE_FORMATS: ALLOWED_IMAGE_FORMATS,
    ALLOWED_VIDEO_FORMATS: ALLOWED_VIDEO_FORMATS,
    ALLOWED_DOCUMENT_FORMATS: ALLOWED_DOCUMENT_FORMATS,
  };

  ngOnInit(): void {
    for (const format of this.config().formats) {
      this.validFileFormats +=
        this.formats['ALLOWED_' + format.toUpperCase() + '_FORMATS'].join(',') +
        ',';
    }
  }

  onFilePicked(event: Event) {
    const inputElement = event.currentTarget as HTMLInputElement;
    const files = inputElement.files;
    if (!files || files.length === 0) {
      console.error('No file picked');

      return;
    } else if (files.length < this.config().min) {
      console.error('Add more files');

      return;
    } else if (files.length > this.config().max) {
      console.error('Add fewer files');
      return;
    }

    this.files = files as unknown as (File & { src: string })[];
    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      this.files[i].src = URL.createObjectURL(element);
    }
    this.filesDropped.emit(files);
  }

  cancel() {
    this.files = [];
    this.filesDropped.emit([] as any);
  }

  removeFile(index: number) {
    const files = [];
    for (let i = 0; i < this.files.length; i++) {
      const element = this.files[i];
      if (index === i) {
      } else files.push(element);
    }
    this.files = files;
    this.filesDropped.emit(files as unknown as FileList);
  }
}
