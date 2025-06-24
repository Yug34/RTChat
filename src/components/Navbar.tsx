import { ModeToggle } from "./mode-toggle.tsx";

const Navbar: React.FC = () => {
    return (
        <header className="flex items-center h-14 px-4 border-b w-full">
            <div className="mr-6 flex items-center gap-2">
                Peer-to-peer video chat
            </div>
            <nav className="flex-1 justify-end hidden md:flex">
                <ModeToggle />
            </nav>
        </header>
    )
}

export default Navbar