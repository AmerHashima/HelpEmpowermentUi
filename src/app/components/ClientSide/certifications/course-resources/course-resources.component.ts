import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { CourseVideosService } from '../../../../Services/course-videos.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of, startWith, distinctUntilChanged } from 'rxjs';

interface ResourceItem {
  type: 'pdf' | 'image' | 'presentation' | string;
  name: string;
  src: string;
}

function fileTypeFromUrl(url: string): ResourceItem['type'] {
  const ext = url.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
  if (['ppt', 'pptx'].includes(ext)) return 'presentation';
  return ext;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AccordionComponent
  ],
  templateUrl: './course-resources.component.html',
  styleUrls: ['./course-resources.component.scss']
})
export class ResourcesComponent {
  private shared = inject(Shared);
  private courseVideosService = inject(CourseVideosService);

  private attachmentsState = toSignal(
    toObservable(this.shared.currentVideoOid).pipe(
      distinctUntilChanged(),
      switchMap(videoOid => {
        if (!videoOid) {
          return of({ data: [] as ResourceItem[], loading: false });
        }
        return this.courseVideosService.getAttachmentsByVideo(videoOid).pipe(
          map(attachments => ({
            data: attachments.map(a => ({
              type: fileTypeFromUrl(a.fileUrl || a.fileName),
              name: a.fileName,
              src: this.courseVideosService.getAttachmentAccessUrl(a),
            })),
            loading: false,
          })),
          startWith({ data: [] as ResourceItem[], loading: true }),
          catchError(() => of({ data: [] as ResourceItem[], loading: false }))
        );
      })
    ),
    { initialValue: { data: [] as ResourceItem[], loading: false } }
  );

  resources = computed(() => this.attachmentsState().data);
  loading = computed(() => this.attachmentsState().loading);
  readonly accordionTitle = 'Course Resources';
}

