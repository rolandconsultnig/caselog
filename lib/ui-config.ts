// 🎨 UI Configuration - Human-readable interface settings

import { THEME_COLORS, APP_CONFIG } from './constants';

export const UI_CONFIG = {
  // 🎯 General Settings
  app: {
    name: APP_CONFIG.name,
    fullName: APP_CONFIG.fullName,
    description: APP_CONFIG.description,
    version: APP_CONFIG.version,
    baseUrl: APP_CONFIG.baseUrl,
  },

  // 🎨 Theme Configuration
  theme: {
    colors: THEME_COLORS,
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },

  // 📱 Layout Configuration
  layout: {
    header: {
      height: '64px',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      shadow: 'sm',
    },
    sidebar: {
      width: '280px',
      collapsedWidth: '80px',
      backgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
    },
    main: {
      padding: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    footer: {
      height: '60px',
      backgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
    },
  },

  // 🧩 Component Configuration
  components: {
    button: {
      sizes: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
      variants: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
    },
    card: {
      padding: '1.5rem',
      borderRadius: 'lg',
      shadow: 'md',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
    },
    input: {
      sizes: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      },
      variants: {
        default: 'border border-gray-300 bg-white',
        filled: 'bg-gray-50 border-gray-200',
        error: 'border-red-300 bg-red-50',
      },
    },
    table: {
      header: {
        backgroundColor: '#f9fafb',
        textColor: '#374151',
        borderColor: '#e5e7eb',
      },
      row: {
        hoverBackgroundColor: '#f9fafb',
        stripedBackgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
      },
      cell: {
        padding: '0.75rem 1rem',
        textColor: '#374151',
      },
    },
  },

  // 📊 Charts Configuration
  charts: {
    colors: THEME_COLORS.chart,
    defaultType: 'line',
    responsive: true,
    animation: true,
    legend: {
      position: 'top' as const,
      align: 'center' as const,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textColor: '#ffffff',
      borderRadius: 'md',
    },
  },

  // 📱 Responsive Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ⚡ Animation Configuration
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    transitions: {
      fade: 'opacity 0.3s ease-in-out',
      slide: 'transform 0.3s ease-in-out',
      scale: 'transform 0.2s ease-in-out',
    },
  },

  // 🔔 Notification Configuration
  notifications: {
    position: 'top-right' as const,
    duration: APP_CONFIG.toastDuration,
    types: {
      success: {
        backgroundColor: THEME_COLORS.success[500],
        textColor: '#ffffff',
        icon: '✓',
      },
      error: {
        backgroundColor: THEME_COLORS.error[500],
        textColor: '#ffffff',
        icon: '✕',
      },
      warning: {
        backgroundColor: THEME_COLORS.warning[500],
        textColor: '#ffffff',
        icon: '⚠',
      },
      info: {
        backgroundColor: THEME_COLORS.primary[500],
        textColor: '#ffffff',
        icon: 'ℹ',
      },
    },
  },

  // 📄 Form Configuration
  forms: {
    validation: {
      showError: true,
      showSuccess: false,
      realTime: true,
      debounceDelay: 300,
    },
    layout: {
      labelPosition: 'top' as const,
      fieldSpacing: 'md',
      groupSpacing: 'lg',
    },
    submission: {
      loadingText: 'Submitting...',
      successText: 'Submitted successfully!',
      errorText: 'Submission failed. Please try again.',
    },
  },

  // 📊 Data Display Configuration
  dataDisplay: {
    pagination: {
      defaultPageSize: APP_CONFIG.defaultPageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: true,
    },
    empty: {
      illustration: '/images/empty-state.svg',
      title: 'No data available',
      description: 'There are no items to display at the moment.',
      actionText: 'Create new item',
    },
    loading: {
      spinner: true,
      skeleton: true,
      overlay: true,
      text: 'Loading...',
    },
    error: {
      illustration: '/images/error-state.svg',
      title: 'Something went wrong',
      description: 'An error occurred while loading the data.',
      actionText: 'Try again',
    },
  },

  // 🎯 Accessibility Configuration
  accessibility: {
    focusVisible: true,
    reducedMotion: false,
    highContrast: false,
    fontSize: {
      small: '14px',
      medium: '16px',
      large: '18px',
      extraLarge: '20px',
    },
  },

  // 🌍 Internationalization
  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'ha', 'yo', 'ig'], // English, Hausa, Yoruba, Igbo
    fallbackLocale: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    currency: 'NGN',
    numberFormat: 'en-NG',
  },

  // 🔍 Search Configuration
  search: {
    placeholder: 'Search...',
    minQueryLength: 2,
    debounceDelay: 300,
    maxResults: 10,
    showRecent: true,
    showSuggestions: true,
    highlightMatches: true,
  },

  // 📱 Mobile Configuration
  mobile: {
    sidebarCollapsed: true,
    touchOptimized: true,
    swipeGestures: true,
    pullToRefresh: true,
    infiniteScroll: true,
  },

  // 🎨 Brand Configuration
  brand: {
    logo: {
      src: '/images/logo.png',
      alt: APP_CONFIG.name,
      width: 40,
      height: 40,
    },
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
    manifest: '/site.webmanifest',
    themeColor: THEME_COLORS.primary[600],
  },
} as const;

// 🎯 Helper Functions
export const getColor = (colorPath: string) => {
  const paths = colorPath.split('.');
  let color: unknown = UI_CONFIG.theme.colors;
  
  for (const path of paths) {
    if (typeof color !== 'object' || color === null) {
      return undefined;
    }
    color = (color as Record<string, unknown>)[path];
  }
  
  return color;
};

export const getBreakpoint = (size: keyof typeof UI_CONFIG.breakpoints) => {
  return UI_CONFIG.breakpoints[size];
};

export const getButtonClasses = (variant: keyof typeof UI_CONFIG.components.button.variants, size: keyof typeof UI_CONFIG.components.button.sizes) => {
  return `${UI_CONFIG.components.button.variants[variant]} ${UI_CONFIG.components.button.sizes[size]}`;
};

export const getAnimationDuration = (speed: keyof typeof UI_CONFIG.animations.durations) => {
  return UI_CONFIG.animations.durations[speed];
};

export const getNotificationConfig = (type: keyof typeof UI_CONFIG.notifications.types) => {
  return UI_CONFIG.notifications.types[type];
};

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < parseInt(UI_CONFIG.breakpoints.md);
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= parseInt(UI_CONFIG.breakpoints.md) && width < parseInt(UI_CONFIG.breakpoints.lg);
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= parseInt(UI_CONFIG.breakpoints.lg);
};

// 🎨 Theme Utilities
export const createTheme = (customColors?: Partial<typeof THEME_COLORS>) => {
  return {
    ...UI_CONFIG.theme,
    colors: {
      ...UI_CONFIG.theme.colors,
      ...customColors,
    },
  };
};

export const applyTheme = (theme: typeof UI_CONFIG.theme) => {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        root.style.setProperty(`--color-${key}-${subKey}`, subValue as string);
      });
    } else {
      root.style.setProperty(`--color-${key}`, value as string);
    }
  });
};

// 📱 Responsive Utilities
export const responsive = {
  mobile: (styles: string) => `@media (max-width: ${UI_CONFIG.breakpoints.sm}) { ${styles} }`,
  tablet: (styles: string) => `@media (min-width: ${UI_CONFIG.breakpoints.md}) and (max-width: ${UI_CONFIG.breakpoints.lg}) { ${styles} }`,
  desktop: (styles: string) => `@media (min-width: ${UI_CONFIG.breakpoints.lg}) { ${styles} }`,
};

// 🎯 Component Factory
export const createComponentConfig = (
  name: keyof typeof UI_CONFIG.components,
  config: Record<string, unknown>
) => {
  return {
    name,
    ...UI_CONFIG.components[name],
    ...config,
  };
};

// 📊 Chart Configuration Helper
export const getChartConfig = (type: string) => {
  return {
    ...UI_CONFIG.charts,
    type,
    colors: UI_CONFIG.charts.colors,
    responsive: UI_CONFIG.charts.responsive,
  };
};
