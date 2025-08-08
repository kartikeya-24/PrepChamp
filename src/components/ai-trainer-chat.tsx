
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { SendHorizonal, Mic, Square } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { askAiTrainer, convertSpeechToText } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  audioDataUri?: string;
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
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await askAiTrainer({ question: text });
      
      const aiMessage: Message = {
          id: Date.now() + 1,
          role: 'ai',
          content: result.success ? result.answer! : result.error!,
          audioDataUri: result.success ? result.audioDataUri : undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (result.success && result.audioDataUri) {
        if(audioPlayerRef.current) {
            audioPlayerRef.current.src = result.audioDataUri;
            audioPlayerRef.current.play().catch(e => console.error("Audio playback failed", e));
        }
      }
    } catch(e) {
         const aiMessage: Message = {
            id: Date.now() + 1,
            role: 'ai',
            content: "Sorry, an unexpected error occurred.",
        };
        setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  }
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            try {
                const response = await convertSpeechToText({ audioDataUri: base64Audio });
                if (response.success && response.data.text) {
                    setInput(response.data.text);
                } else {
                     toast({
                        variant: "destructive",
                        title: "Transcription Failed",
                        description: response.error || "Could not understand audio. Please try again.",
                    });
                }
            } catch (e) {
                toast({
                    variant: "destructive",
                    title: "Transcription Error",
                    description: "An unexpected error occurred during transcription.",
                });
            } finally {
                setIsTranscribing(false);
            }
        };
        
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access microphone. Please check your browser permissions.",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const getPlaceholderText = () => {
    if (isRecording) return "Listening...";
    if (isTranscribing) return "Transcribing...";
    return "Type your question here...";
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
        <audio ref={audioPlayerRef} className="hidden" />
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
                               <AvatarFallback>A</AvatarFallback>
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
                            <AvatarFallback>A</AvatarFallback>
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
            <form onSubmit={handleFormSubmit} className="flex items-start gap-4 max-w-3xl mx-auto">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getPlaceholderText()}
                    className="flex-1 resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleFormSubmit(e);
                        }
                    }}
                    disabled={isLoading || isRecording || isTranscribing}
                />
                <Button type="button" size="icon" onClick={handleMicClick} variant={isRecording ? 'destructive' : 'ghost'} disabled={isLoading || isTranscribing}>
                    {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || !input.trim() || isRecording || isTranscribing}>
                    <SendHorizonal className="w-5 h-5" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
    </div>
  );
}
