import { Component } from '@angular/core';

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
  imports: [],
  standalone: true,
  templateUrl: './timeline-component.html',
  styleUrl: './timeline-component.scss',
})

export class TimelineComponent {
  readonly timelineItems: TimelineItem[] = [
    {
      title: 'Junior Engineer',
      organization: 'Netcompany - Intrasoft',
      period: 'October 2024 - Present',
      location: 'Patras, Greece',
      description:
        'Currently working as a Junior Engineer, contributing to software development projects and strengthening my professional experience in a real-world engineering environment.',
      category: 'experience',
      icon: 'work',
      current: true,
    },
    {
      title: 'Front-End Development Intern',
      organization: 'Netcompany - Intrasoft',
      period: 'June 2024 - October 2024',
      location: 'Athens, Greece',
      description:
        'Completed my university internship with a primary focus on Front-End Development, gaining practical experience in modern web technologies and professional development workflows.',
      category: 'experience',
      icon: 'code',
    },
    {
      title: 'BSc in Informatics and Telecommunications',
      organization: 'University of the Peloponnese',
      period: 'December 2019 - February 2025',
      location: 'Tripoli, Greece',
      description:
        'Graduated from the Department of Informatics and Telecommunications, building a strong foundation in software development, computer networks, databases and information systems.',
      category: 'education',
      icon: 'school',
    },
    {
      title: 'Certificate of Information Security Administrator',
      organization: 'Foresight',
      period: 'April 2023',
      location: 'Tripoli, Greece',
      description:
        'Attended this seminar in the context of the Systems Security university course, focusing on information security administration and security practices.',
      category: 'education',
      icon: 'security',
    },
    {
      title: 'High School Diploma',
      period: 'July 2019',
      location: 'Aigio, Greece',
      description:
        'Successfully completed secondary education and received my High School Diploma.',
      category: 'education',
      icon: 'workspace_premium',
    },
    {
      title: 'Certificate of English Language Proficiency – B2',
      organization: 'Michigan ECCE',
      period: 'May 2016',
      location: 'Aigio, Greece',
      description:
        'Awarded the Examination for the Certificate of Competency in English at B2 level.',
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
