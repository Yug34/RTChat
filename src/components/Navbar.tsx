import { Github } from 'lucide-react'
import { Button } from './ui/button'

const Navbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-14 px-4 border-b w-full bg-card">
      <div className="mr-6 flex items-center gap-2">
        <b>RTChat</b> - P2P video chat
      </div>
      <nav className="flex flex-1 justify-end">
        <a href="https://github.com/yug34/rtc-chat" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="cursor-pointer">
            <span className="ml-2">View source code</span>
            <Github />
          </Button>
        </a>
      </nav>
    </header>
  )
}

export default Navbar
