import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../translate.pipe';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../translate.service';
import { LoadingSpinner } from '../../loading-spinner/loading-spinner';

type TimelineCategory = 'experience' | 'education';

interface TimelineItem {
  title: string;
  organization?: string;
  period: string;
  location: string;
  description: string;
  category: TimelineCategory;
  icon: string;
  current?: boolean;
}

@Component({
  selector: 'app-timeline-component',
  imports: [CommonModule, TranslatePipe, LoadingSpinner],
  standalone: true,
  templateUrl: './timeline-component.html',
  styleUrl: './timeline-component.scss',
})

export class TimelineComponent {
  private translateService = inject(TranslateService);
  readonly language = this.translateService.language;
  readonly educationLoading = signal(false);
  readonly itemLoading = signal<Record<string, boolean>>({});
  readonly showAllEducation = signal(false);
  readonly visibleEducationItems = computed(() =>
    this.showAllEducation()
      ? this.educationItems
      : this.educationItems.slice(0, 2),
  );

  private getItemKey(item: TimelineItem): string {
    return item.title;
  }

  isItemLoading(item: TimelineItem): boolean {
    return this.itemLoading()[this.getItemKey(item)] === true;
  }

  toggleEducation(): void {
    if (this.educationLoading()) {
      return;
    }

    const currentlyVisible = this.visibleEducationItems();
    const nextVisible = this.showAllEducation()
      ? this.educationItems.slice(0, 2)
      : this.educationItems;

    const newlyVisible = nextVisible.filter(
      item => !currentlyVisible.some(current => current.title === item.title),
    );

    this.itemLoading.update(current => ({
      ...current,
      ...newlyVisible.reduce<Record<string, boolean>>((acc, item) => {
        acc[this.getItemKey(item)] = true;
        return acc;
      }, {}),
    }));

    this.educationLoading.set(true);
    setTimeout(() => {
      this.showAllEducation.update(value => !value);
      this.educationLoading.set(false);

      newlyVisible.forEach((item, index) => {
        const key = this.getItemKey(item);
        setTimeout(() => {
          this.itemLoading.update(current => ({
            ...current,
            [key]: false,
          }));
        }, 120 + index * 70);
      });
    }, 220);
  }
  
  readonly timelineItems: TimelineItem[] = [
    {
      title: 'timeline.items.juniorEngineer.title',
      organization: 'timeline.items.juniorEngineer.organization',
      period: 'timeline.items.juniorEngineer.period',
      location: 'timeline.items.juniorEngineer.location',
      description: 'timeline.items.juniorEngineer.description',
      category: 'experience',
      icon: 'work',
      current: true,
    },
    {
      title: 'timeline.items.frontendIntern.title',
      organization: 'timeline.items.frontendIntern.organization',
      period: 'timeline.items.frontendIntern.period',
      location: 'timeline.items.frontendIntern.location',
      description: 'timeline.items.frontendIntern.description',
      category: 'experience',
      icon: 'code',
    },
    {
      title: 'timeline.items.bsc.title',
      organization: 'timeline.items.bsc.organization',
      period: 'timeline.items.bsc.period',
      location: 'timeline.items.bsc.location',
      description: 'timeline.items.bsc.description',
      category: 'education',
      icon: 'school',
    },
    {
      title: 'timeline.items.securityCertificate.title',
      organization: 'timeline.items.securityCertificate.organization',
      period: 'timeline.items.securityCertificate.period',
      location: 'timeline.items.securityCertificate.location',
      description: 'timeline.items.securityCertificate.description',
      category: 'education',
      icon: 'security',
    },
    {
      title: 'timeline.items.highSchoolDiploma.title',
      period: 'timeline.items.highSchoolDiploma.period',
      location: 'timeline.items.highSchoolDiploma.location',
      description: 'timeline.items.highSchoolDiploma.description',
      category: 'education',
      icon: 'workspace_premium',
    },
    {
      title: 'timeline.items.englishCertificate.title',
      organization: 'timeline.items.englishCertificate.organization',
      period: 'timeline.items.englishCertificate.period',
      location: 'timeline.items.englishCertificate.location',
      description: 'timeline.items.englishCertificate.description',
      category: 'education',
      icon: 'language',
    },
  ];

  readonly experienceItems = this.timelineItems.filter(
    item => item.category === 'experience',
  );

  readonly educationItems = this.timelineItems.filter(
    item => item.category === 'education',
  );
}
