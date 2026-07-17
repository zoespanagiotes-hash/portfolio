import { Component, computed, signal } from '@angular/core';

type SkillCategory = 'skills' | 'tools' | 'services';

interface SkillItem {
  name: string;
  icon: string;
}

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  number: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  readonly activeCategory = signal<SkillCategory>('skills');

  readonly skills: SkillItem[] = [
    {
      name: 'Angular',
      icon: 'deployed_code',
    },
    {
      name: 'TypeScript',
      icon: 'code',
    },
    {
      name: 'JavaScript',
      icon: 'javascript',
    },
    {
      name: 'HTML',
      icon: 'html',
    },
    {
      name: 'CSS',
      icon: 'css',
    },
    {
      name: 'Tailwind CSS',
      icon: 'palette',
    },
  ];

  readonly tools: SkillItem[] = [
    {
      name: 'Git',
      icon: 'source',
    },
    {
      name: 'GitHub',
      icon: 'hub',
    },
    {
      name: 'VS Code',
      icon: 'terminal',
    },
    {
      name: 'Postman',
      icon: 'send',
    },
    {
      name: 'Figma',
      icon: 'design_services',
    },
    {
      name: 'npm',
      icon: 'package_2',
    },
  ];

  readonly services: ServiceItem[] = [
    {
      number: '01',
      title: 'Web Development',
      description:
        'Crafting responsive and intuitive websites using modern front-end technologies.',
      icon: 'language',
    },
    {
      number: '02',
      title: 'UI/UX Design',
      description:
        'Creating visually appealing and user-focused interfaces.',
      icon: 'design_services',
    },
    {
      number: '03',
      title: 'Custom CMS Solutions',
      description:
        'Building efficient content management solutions for scalable websites.',
      icon: 'dashboard_customize',
    },
    {
      number: '04',
      title: 'Mobile App Development',
      description:
        'Designing responsive and user-friendly mobile application interfaces.',
      icon: 'smartphone',
    },
    {
      number: '05',
      title: 'E-commerce Development',
      description:
        'Creating modern and reliable online storefronts.',
      icon: 'shopping_cart',
    },
    {
      number: '06',
      title: 'API Integration',
      description:
        'Connecting applications with external services and APIs.',
      icon: 'hub',
    },
  ];

  readonly visibleItems = computed(() => {
    switch (this.activeCategory()) {
      case 'tools':
        return this.tools;

      case 'skills':
      default:
        return this.skills;
    }
  });

  setActiveCategory(category: SkillCategory): void {
    this.activeCategory.set(category);
  }
}