import { Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t py-8 px-4 bg-card/50 mt-auto">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            For enquiries/help contact:{" "}
            <a 
              href="mailto:reviewgaurd01@gmail.com" 
              className="text-primary hover:underline font-medium"
            >
              reviewgaurd01@gmail.com
            </a>
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          © 2025 ReviewGuard. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
