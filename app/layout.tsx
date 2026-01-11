import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '盖洛普优势 · 行动方案生成器',
  description: '把你的优势，翻译成当下可执行的决策建议',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}