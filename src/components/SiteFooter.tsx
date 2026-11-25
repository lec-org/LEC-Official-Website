/**
 * 官网页脚组件
 * 展示工作室版权信息、工信部 ICP 备案号及公安联网备案号
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200/80 bg-gray-100 px-6 py-6 text-center font-misans-light text-xs text-gray-500">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
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
        <span className="hidden text-gray-300 sm:inline">|</span>
        <a
          href="https://beian.mps.gov.cn/#/query/webSearch?code=51012902000232"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-gray-500 no-underline transition-colors hover:text-accent"
        >
          <img
            src="/gongan-beian.png"
            alt="公安联网备案图标"
            width={14}
            height={15}
            className="h-3.5 w-auto shrink-0"
          />
          <span>川公网安备51012902000232号</span>
        </a>
      </div>
    </footer>
  )
}
