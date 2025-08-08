'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function Settings() {
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();

  const handleClearData = () => {
    try {
      // Find all keys in localStorage that start with 'mockTestScores_'
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mockTestScores_')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the identified keys
      keysToRemove.forEach(key => localStorage.removeItem(key));

      toast({
        title: "Success",
        description: "Your mock test history has been cleared.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not clear mock test history.",
      });
      console.error("Error clearing local storage:", error);
    }
  }

  return (
    <div className="grid gap-6 max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the app.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="flex gap-2">
                        <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
                            <Sun className="mr-2 h-4 w-4" /> Light
                        </Button>
                         <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
                            <Moon className="mr-2 h-4 w-4" /> Dark
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your application data.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-muted-foreground">
                    This will permanently delete all your saved mock test scores. This action cannot be undone.
                 </p>
            </CardContent>
            <CardFooter>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear Mock Test History
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your mock test history
                            and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearData}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    </div>
  );
}
