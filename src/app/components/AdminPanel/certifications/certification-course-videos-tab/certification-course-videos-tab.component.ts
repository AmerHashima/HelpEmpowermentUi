import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CourseVideosService } from '../../../../Services/course-videos.service';
import { CourseVideo } from '../../../../models/course-video';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';

@Component({
    selector: 'app-certification-course-videos-tab',
    standalone: true,
    imports:[GenericModelComponent,SiteButtonComponent],
    templateUrl: './certification-course-videos-tab.component.html',
    styleUrl: './certification-course-videos-tab.component.scss',
})
export class CertificationCourseVideosTabComponent implements OnChanges {
    @Input() courseId: string = '';

    private courseVideosService = inject(CourseVideosService);
    private router = inject(Router);

    videos = signal<CourseVideo[]>([]);
    loading = signal<boolean>(false);

  showConfirm:boolean=false;
  deleteVideo: CourseVideo | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['courseId']?.currentValue) {
            this.loadVideos();
        }
    }

    loadVideos(): void {
        if (!this.courseId) {
            this.videos.set([]);
            return;
        }

        this.loading.set(true);
        this.courseVideosService.getAllVideos(this.courseId).subscribe({
            next: (videos) => {
                this.videos.set(videos ?? []);
                this.loading.set(false);
            },
            error: () => {
                this.videos.set([]);
                this.loading.set(false);
            },
        });
    }

    onAddVideo(): void {
        if (!this.courseId) {
            return;
        }
        this.router.navigate(['/admin/certifications', this.courseId, 'videos', 'create']);
    }

    onEditVideo(video: CourseVideo): void {
        if (!this.courseId || !video?.oid) {
            return;
        }
        this.router.navigate(['/admin/certifications', this.courseId, 'videos', video.oid, 'edit']);
    }

    // onDeleteVideo(video: CourseVideo): void {
    //     if (!video?.oid) {
    //         return;
    //     }

    //     this.courseVideosService.deleteVideo(video.oid).subscribe({
    //         next: () => this.loadVideos(),
    //     });
    // }

  onDeleteVideo(video: CourseVideo): void {
    this.showConfirm=true;
    this.deleteVideo=video
  }

  onCancalDeleteVideo(){
    this.showConfirm = false;
  }

  onConfirmDeleteVideo(){
   if(this.deleteVideo){
    this.showConfirm=false;
    const video=this.deleteVideo;
     if (!video?.oid) {
       return;
     }

     this.courseVideosService.deleteVideo(video.oid).subscribe({
       next: () => this.loadVideos(),
     });
   }
  }
}
