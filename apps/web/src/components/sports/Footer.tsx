import { Github, Heart, Mail, Trophy, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="paper-texture w-full border-orange-200 border-t bg-orange-50/95">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <Trophy className="h-4 w-4" />
              </div>
              <span className="font-bold font-serif text-lg text-orange-900">
                SportX
              </span>
            </div>
            <p className="max-w-xs text-center text-orange-600 text-sm md:text-left">
              Your trusted source for live sports scores, match updates, and
              real-time game tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="mb-3 font-semibold text-orange-900 text-sm">
              Quick Links
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              <FooterLink href="#">Live Matches</FooterLink>
              <FooterLink href="#">Schedule</FooterLink>
              <FooterLink href="#">Leagues</FooterLink>
              <FooterLink href="#">Teams</FooterLink>
              <FooterLink href="#">About</FooterLink>
            </div>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="mb-3 font-semibold text-orange-900 text-sm">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <SocialButton
                href="#"
                icon={<Twitter className="h-4 w-4" />}
                label="Twitter"
              />
              <SocialButton
                href="#"
                icon={<Github className="h-4 w-4" />}
                label="GitHub"
              />
              <SocialButton
                href="#"
                icon={<Mail className="h-4 w-4" />}
                label="Email"
              />
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-orange-200" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 text-orange-600 text-sm sm:flex-row">
          <div className="flex items-center gap-1">
            <span>&copy; {currentYear} SportX. Made with</span>
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            <span>for sports fans.</span>
          </div>
          <div className="flex items-center gap-4">
            <FooterLink href="#" className="text-xs">
              Privacy Policy
            </FooterLink>
            <FooterLink href="#" className="text-xs">
              Terms of Service
            </FooterLink>
            <FooterLink href="#" className="text-xs">
              Contact
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`text-orange-600 transition-colors hover:text-orange-900 ${className || ""}`}
    >
      {children}
    </a>
  );
}

function SocialButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-colors hover:bg-orange-200 hover:text-orange-900"
    >
      {icon}
    </a>
  );
}
