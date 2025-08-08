'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { SendHorizonal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { askAiTrainer } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
}

export function AiTrainerChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      content: "Hello! I'm your AI trainer. Ask me anything about your exam preparation.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const result = await askAiTrainer({ question: currentInput });
    
    const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: result.success ? result.answer! : result.error!,
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6" ref={viewportRef}>
            <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            'flex items-start gap-4',
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.role === 'ai' && (
                            <Avatar className="w-8 h-8 border">
                               <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={cn(
                                'max-w-xl rounded-lg p-3 text-sm shadow-sm',
                                message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card'
                            )}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === 'user' && (
                             <Avatar className="w-8 h-8 border">
                               <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="student avatar"/>
                               <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-4 justify-start">
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="max-w-md rounded-lg p-3 text-sm bg-card shadow-sm">
                           <Skeleton className="w-20 h-4" />
                        </div>
                    </div>
                )}
            </div>
          </div>
        </ScrollArea>
        <div className="border-t bg-background p-4 md:p-6">
            <form onSubmit={handleSendMessage} className="flex items-start gap-4 max-w-3xl mx-auto">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question here..."
                    className="flex-1 resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <SendHorizonal className="w-5 h-5" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
    </div>
  );
}
