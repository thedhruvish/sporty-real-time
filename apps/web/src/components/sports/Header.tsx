import {
  Menu,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Trophy,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isPanelOpen?: boolean;
  onTogglePanel?: () => void;
}

export function Header({
  onRefresh,
  isRefreshing,
  isPanelOpen,
  onTogglePanel,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="paper-texture sticky top-0 z-50 w-full border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold font-serif text-foreground text-xl tracking-tight">
                SportX
              </span>
              <span className="-mt-1 text-muted-foreground text-xs">
                Live Scores
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink href="#" active>
              Live
            </NavLink>
            <NavLink href="#">Scheduled</NavLink>
            <NavLink href="#">Finished</NavLink>
            <NavLink href="#">Leagues</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onTogglePanel && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onTogglePanel}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                title={isPanelOpen ? "Close Panel" : "Open Panel"}
              >
                {isPanelOpen ? (
                  <PanelRightClose className="h-5 w-5" />
                ) : (
                  <PanelRightOpen className="h-5 w-5" />
                )}
              </Button>
            )}

            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <RefreshCw
                  className={cn("h-5 w-5", isRefreshing && "animate-spin")}
                />
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-border border-t py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <MobileNavLink href="#" active>
                Live
              </MobileNavLink>
              <MobileNavLink href="#">Scheduled</MobileNavLink>
              <MobileNavLink href="#">Finished</MobileNavLink>
              <MobileNavLink href="#">Leagues</MobileNavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "font-medium text-sm transition-colors hover:text-primary",
        active
          ? "border-primary border-b-2 pb-1 text-primary"
          : "text-muted-foreground",
      )}
    >
      {children}
    </a>
  );
}

function MobileNavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "block rounded-lg px-3 py-2 font-medium text-sm transition-colors",
        active
          ? "bg-secondary text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-primary",
      )}
    >
      {children}
    </a>
  );
}
