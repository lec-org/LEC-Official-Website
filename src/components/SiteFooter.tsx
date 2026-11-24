/**
 * 官网页脚组件
 * 展示工作室版权信息与工信部 ICP 备案号（后续公安备案通过后可在此并列补充）
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200/80 bg-gray-100 px-6 py-6 text-center font-misans-light text-xs text-gray-500">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
        <span>© 2026 乐程软件工作室</span>
        <span className="hidden text-gray-300 sm:inline">|</span>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 no-underline transition-colors hover:text-accent"
        >
          蜀ICP备2026022598号-2
        </a>
      </div>
    </footer>
  )
}
