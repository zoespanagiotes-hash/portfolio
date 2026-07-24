import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../Components/navbar-component/navbar-component";
import { Footer } from "../../Components/footer/footer";

type CertificationCategory =
  | 'all'
  | 'development'
  | 'security'
  | 'languages'
  | 'other';

interface Certification {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  image: string;
  credentialUrl?: string;
  category: Exclude<CertificationCategory, 'all'>;
  skills: string[];
  featured?: boolean;
}

@Component({
  selector: 'app-certifications',
  imports: [CommonModule, NavbarComponent, Footer],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
})
export class CertificationsComponent {
  activeCategory = signal<CertificationCategory>('all');

  selectedCertificate = signal<Certification | null>(null);

  readonly fallbackImage = 'assets/images/certifications/placeholder-certificate.svg';

  readonly categories: {
    id: CertificationCategory;
    label: string;
  }[] = [
    {
      id: 'all',
      label: 'All'
    },
    {
      id: 'development',
      label: 'Development'
    },
    {
      id: 'security',
      label: 'Security'
    },
    {
      id: 'languages',
      label: 'Languages'
    },
    {
      id: 'other',
      label: 'Other'
    }
  ];

  readonly certifications: Certification[] = [
    {
      id: 1,
      title: 'Information Security Administrator',
      issuer: 'Certification Authority',
      issueDate: 'April 2023',
      description:
        'Information security principles, access control, risk management and protection of digital systems.',
      image:
        'assets/certifications/zois-ασφάλειαΣυστημάτων_page-0001.jpg',
      credentialUrl: '#',
      category: 'security',
      skills: [
        'Information Security',
        'Risk Management',
        'Access Control'
      ],
      featured: true
    },
    {
      id: 2,
      title: 'Michigan ECCE B2',
      issuer: 'Michigan Language Assessment',
      issueDate: 'May 2016',
      description:
        'English language certification demonstrating upper-intermediate communication skills.',
      image: 'assets/certifications/zois-b2-english.jpg',
      credentialUrl: '#',
      category: 'languages',
      skills: [
        'English',
        'Communication',
        'Writing'
      ],
      featured: true
    },
    {
      id: 3,
      title: 'Angular Development',
      issuer: 'Online Learning Platform',
      issueDate: '2025',
      description:
        'Modern Angular development using standalone components, signals, routing and reusable architecture.',
      image: 'assets/images/certifications/placeholder-certificate.svg',
      credentialUrl: '#',
      category: 'development',
      skills: [
        'Angular',
        'TypeScript',
        'Signals',
        'Routing'
      ],
      featured: true
    },
    {
      id: 4,
      title: 'Front-End Development',
      issuer: 'Online Learning Platform',
      issueDate: '2024',
      description:
        'Responsive interfaces using HTML, CSS, JavaScript and modern frontend development practices.',
      image: 'assets/images/certifications/placeholder-certificate.svg',
      credentialUrl: '#',
      category: 'development',
      skills: [
        'HTML',
        'CSS',
        'JavaScript',
        'Responsive Design'
      ]
    },
    {
      id: 5,
      title: 'Git and GitHub Fundamentals',
      issuer: 'Online Learning Platform',
      issueDate: '2024',
      description:
        'Version control workflows, branching, collaboration and repository management.',
      image: 'assets/images/certifications/placeholder-certificate.svg',
      credentialUrl: '#',
      category: 'development',
      skills: [
        'Git',
        'GitHub',
        'Version Control'
      ]
    },
    {
      id: 6,
      title: 'UI/UX Design Fundamentals',
      issuer: 'Online Learning Platform',
      issueDate: '2024',
      description:
        'User interface principles, visual hierarchy, accessibility and user-centered design.',
      image: 'assets/images/certifications/placeholder-certificate.svg',
      credentialUrl: '#',
      category: 'other',
      skills: [
        'UI Design',
        'UX Design',
        'Accessibility'
      ]
    }
  ];

  filteredCertifications = computed(() => {
    const category = this.activeCategory();

    if (category === 'all') {
      return this.certifications;
    }

    return this.certifications.filter(
      certification => certification.category === category
    );
  });

  featuredCertifications = computed(() =>
    this.certifications.filter(
      certification => certification.featured
    )
  );

  totalIssuers = computed(() => {
    const issuers = this.certifications.map(
      certification => certification.issuer
    );

    return new Set(issuers).size;
  });

  setCategory(category: CertificationCategory): void {
    this.activeCategory.set(category);
  }

  onImageError(certificate: Certification): void {
    if (certificate.image !== this.fallbackImage) {
      certificate.image = this.fallbackImage;
    }
  }

  openPreview(certificate: Certification): void {
    this.selectedCertificate.set(certificate);
    document.body.style.overflow = 'hidden';
  }

  closePreview(): void {
    this.selectedCertificate.set(null);
    document.body.style.overflow = '';
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closePreview();
    }
  }
}