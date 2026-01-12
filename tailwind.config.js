/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 新设计系统 - 智性温暖 + 晶石 + 光晕
        // 背景色系（冷色系，专业感）
        bg: {
          primary: '#F8F9FA',      // 主背景 - 冷色系浅灰
          secondary: '#F1F3F5',    // 次背景 - 冷色系中灰
          tertiary: '#E9ECEF',    // 第三背景 - 冷色系深灰
          card: '#FFFFFF',         // 卡片背景
          elevated: '#FFFFFF',     // 浮层背景
        },
        // 品牌色 - 胡桃木色系（专业、温润、有底蕴）
        brand: {
          DEFAULT: '#6B5B4D',      // 主品牌色 - 深棕木
          light: '#8B7355',        // 浅棕木
          lighter: '#A69076',      // 更浅
          dark: '#4A3F35',         // 深棕木
          muted: '#6B5B4D1A',      // 10% 透明度
          subtle: '#6B5B4D0D',     // 5% 透明度
        },
        // 强调色 - 温暖金棕（人文温度）
        accent: {
          DEFAULT: '#B8956B',      // 温暖金棕
          light: '#D4B896',        // 浅金棕
          dark: '#96754A',         // 深金棕
          muted: '#B8956B1A',      // 10% 透明度
        },
        // 文字色系（深灰，专业感）
        text: {
          primary: '#212529',      // 主文字 - 深灰
          secondary: '#495057',    // 次要文字 - 中灰
          tertiary: '#6C757D',     // 第三文字 - 浅灰
          muted: '#ADB5BD',        // 辅助文字 - 更浅灰
          inverse: '#FFFFFF',      // 反色文字
        },
        // 边框色系
        border: {
          DEFAULT: '#E5E2DE',      // 默认边框
          light: '#F0EDEA',        // 浅边框
          dark: '#D4D0CB',         // 深边框
          focus: '#6B5B4D',        // 聚焦边框
        },
        // 领域色彩 - 柔和的专业色调
        domain: {
          executing: '#5B8A72',    // 执行力 - 沉稳绿
          influencing: '#C4956A',  // 影响力 - 温暖橙
          relationship: '#7B6B8A', // 关系建立 - 优雅紫
          strategic: '#5A7A9A',    // 战略思维 - 深邃蓝
        },
        // 状态色 - 柔和版本
        status: {
          success: '#5B8A72',      // 成功 - 沉稳绿
          warning: '#C4956A',      // 警告 - 温暖橙
          error: '#B85A5A',        // 错误 - 柔和红
          info: '#5A7A9A',         // 信息 - 深邃蓝
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Serif Pro"', '"Songti SC"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // 标题系统
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        // 正文系统
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        // 标签系统
        'label': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '500' }],
        'caption': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        'elevated': '0 4px 6px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.06)',
        'float': '0 8px 16px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.08)',
        'glow': '0 0 0 1px rgba(107,91,77,0.1), 0 4px 16px rgba(107,91,77,0.1)',
        'glow-lg': '0 0 0 1px rgba(107,91,77,0.15), 0 8px 32px rgba(107,91,77,0.15)',
        'inner-soft': 'inset 0 1px 2px rgba(0,0,0,0.04)',
      },
      backgroundImage: {
        // 微妙的纸张纹理
        'paper-subtle': `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
        // 温暖渐变
        'warm-gradient': 'linear-gradient(135deg, #FAFAF8 0%, #F5F3F0 100%)',
        'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 100%)',
        // 品牌渐变
        'brand-gradient': 'linear-gradient(135deg, #6B5B4D 0%, #8B7355 100%)',
        'accent-gradient': 'linear-gradient(135deg, #B8956B 0%, #D4B896 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
