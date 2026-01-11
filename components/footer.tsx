"use client"

import { TrendingUp, BookOpen, Shield, Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-br from-card/50 to-card mt-12 backdrop-blur">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Finance Dashboard
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              AI-powered financial analytics for the Casablanca Stock Exchange. 
              Make smarter investment decisions with real-time data and insights.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Product
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Education
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  Investing Basics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  Market Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  Risk Management
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Finance Dashboard. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Data provided for informational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
