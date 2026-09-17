import { Component, OnDestroy, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../translate.pipe';

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
  imports: [TranslatePipe],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills implements OnDestroy {
  readonly activeCategory = signal<SkillCategory>('skills');

  private readonly categoryOrder: SkillCategory[] = ['skills', 'tools', 'services'];
  private dragStartX = 0;
  private dragStartY = 0;
  private readonly pointerUpHandler = (event: PointerEvent) => this.onPointerUp(event);

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

  // pointer events cover mouse (desktop drag) and touch in one handler pair
  onPointerDown(event: PointerEvent): void {
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    window.addEventListener('pointerup', this.pointerUpHandler);
  }

  private onPointerUp(event: PointerEvent): void {
    window.removeEventListener('pointerup', this.pointerUpHandler);

    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    const minSwipeDistance = 50;

    if (Math.abs(deltaX) < minSwipeDistance || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    const currentIndex = this.categoryOrder.indexOf(this.activeCategory());
    const nextIndex =
      deltaX < 0
        ? Math.min(currentIndex + 1, this.categoryOrder.length - 1)
        : Math.max(currentIndex - 1, 0);

    if (nextIndex !== currentIndex) {
      this.setActiveCategory(this.categoryOrder[nextIndex]);
    }
  }

  setActiveCategory(category: SkillCategory): void {
    this.activeCategory.set(category);
  }

  ngOnDestroy(): void {
    window.removeEventListener('pointerup', this.pointerUpHandler);
  }
}