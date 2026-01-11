"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp,
  BookOpen,
  HelpCircle,
  Loader2
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "What is the MASI index?",
  "How does trading work on Casablanca Stock Exchange?",
  "What are the trading hours?",
  "Explain market capitalization",
  "What is a dividend yield?",
  "How to analyze stocks?",
]

export default function LearningChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Welcome to the Bourse de Casablanca Learning Assistant! I'm here to help you understand the Moroccan stock market, trading concepts, and investment strategies. Feel free to ask me anything about:\n\n• Market indices (MASI, MADEX)\n• Listed companies\n• Trading rules and hours\n• Investment concepts\n• Technical analysis\n\nHow can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I apologize, but I couldn't process your request. Please try again.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting to the server. Please make sure the backend is running and try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            Learning Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Ask questions about Bourse de Casablanca and investment concepts
          </p>
        </div>
        <Badge variant="outline" className="gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
          <Sparkles className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-3 border-0 shadow-lg bg-card/80 backdrop-blur flex flex-col h-[600px]">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-5 w-5 text-primary" />
              Chat with AI Assistant
            </CardTitle>
            <CardDescription>
              Get instant answers about the Moroccan stock market
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                    }`}>
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${
                      message.role === "user" ? "text-right" : ""
                    }`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted rounded-tl-none"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-2">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-muted/30">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Bourse de Casablanca..."
                  className="flex-1 bg-background border-border/50 focus:border-primary"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Suggested Questions */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Suggested Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(question)}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Topics */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Quick Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["MASI", "MADEX", "Dividends", "P/E Ratio", "Volume", "IPO", "Sectors"].map((topic) => (
                <Badge 
                  key={topic}
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => sendMessage(`Tell me about ${topic}`)}
                >
                  {topic}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Learning Progress</p>
                  <p className="text-xs text-muted-foreground">
                    {messages.filter(m => m.role === "user").length} questions asked
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
