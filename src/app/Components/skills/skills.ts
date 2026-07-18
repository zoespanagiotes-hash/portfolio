import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../translate.pipe';
import { LoadingSpinner } from '../../loading-spinner/loading-spinner';

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
  imports: [TranslatePipe, LoadingSpinner],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  readonly activeCategory = signal<SkillCategory>('skills');
  readonly loadingItems = signal<Record<string, boolean>>({
    'skills.tech.angular': false,
    'skills.tech.typescript': false,
    'skills.tech.javascript': false,
    'skills.tech.html': false,
    'skills.tech.css': false,
    'skills.tech.tailwind': false,
    'skills.tools.git': false,
    'skills.tools.github': false,
    'skills.tools.vscode': false,
    'skills.tools.postman': false,
    'skills.tools.figma': false,
    'skills.tools.npm': false,
    'skills.services.webDevelopment.title': false,
    'skills.services.uiuxDesign.title': false,
    'skills.services.customCms.title': false,
    'skills.services.mobileApp.title': false,
    'skills.services.ecommerce.title': false,
    'skills.services.apiIntegration.title': false,
  });

  private getCardKey(item: SkillItem | ServiceItem): string {
    return 'name' in item ? item.name : item.title;
  }

  isItemLoading(item: SkillItem | ServiceItem): boolean {
    return this.loadingItems()[this.getCardKey(item)] || false;
  }

  readonly skills: SkillItem[] = [
    {
      name: 'skills.tech.angular',
      icon: 'deployed_code',
    },
    {
      name: 'skills.tech.typescript',
      icon: 'code',
    },
    {
      name: 'skills.tech.javascript',
      icon: 'javascript',
    },
    {
      name: 'skills.tech.html',
      icon: 'html',
    },
    {
      name: 'skills.tech.css',
      icon: 'css',
    },
    {
      name: 'skills.tech.tailwind',
      icon: 'palette',
    },
  ];

  readonly tools: SkillItem[] = [
    {
      name: 'skills.tools.git',
      icon: 'source',
    },
    {
      name: 'skills.tools.github',
      icon: 'hub',
    },
    {
      name: 'skills.tools.vscode',
      icon: 'terminal',
    },
    {
      name: 'skills.tools.postman',
      icon: 'send',
    },
    {
      name: 'skills.tools.figma',
      icon: 'design_services',
    },
    {
      name: 'skills.tools.npm',
      icon: 'package_2',
    },
  ];

  readonly services: ServiceItem[] = [
    {
      number: '01',
      title: 'skills.services.webDevelopment.title',
      description: 'skills.services.webDevelopment.description',
      icon: 'language',
    },
    {
      number: '02',
      title: 'skills.services.uiuxDesign.title',
      description: 'skills.services.uiuxDesign.description',
      icon: 'design_services',
    },
    {
      number: '03',
      title: 'skills.services.customCms.title',
      description: 'skills.services.customCms.description',
      icon: 'dashboard_customize',
    },
    {
      number: '04',
      title: 'skills.services.mobileApp.title',
      description: 'skills.services.mobileApp.description',
      icon: 'smartphone',
    },
    {
      number: '05',
      title: 'skills.services.ecommerce.title',
      description: 'skills.services.ecommerce.description',
      icon: 'shopping_cart',
    },
    {
      number: '06',
      title: 'skills.services.apiIntegration.title',
      description: 'skills.services.apiIntegration.description',
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
    if (this.activeCategory() === category) {
      return;
    }

    const nextItems =
      category === 'tools' ? this.tools : category === 'services' ? this.services : this.skills;

    const nextLoading = nextItems.reduce<Record<string, boolean>>((acc, item) => {
      acc[this.getCardKey(item)] = true;
      return acc;
    }, {});

    this.loadingItems.update(current => ({
      ...current,
      ...nextLoading,
    }));

    this.activeCategory.set(category);

    nextItems.forEach((item, index) => {
      const key = this.getCardKey(item);
      setTimeout(() => {
        this.loadingItems.update(current => ({
          ...current,
          [key]: false,
        }));
      }, 150 + index * 120);
    });
  }
}