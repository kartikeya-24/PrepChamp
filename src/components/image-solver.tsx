'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, FileImage, Loader2, Sparkles, Terminal, Upload } from 'lucide-react';
import { solveQuestionFromImage } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export function ImageSolver() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Webcam state
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Cleanup function to stop video stream when component unmounts or tab changes
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const getCameraPermission = async () => {
        if (hasCameraPermission) return; // Don't ask again if already granted
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description: 'Please enable camera permissions in your browser settings.',
            });
        }
    };
    
    const handleTabChange = (value: string) => {
        if (value === 'webcam') {
           getCameraPermission();
        } else {
            // Stop camera when switching away
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
             }
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setImagePreview(dataUri);
                setImageDataUri(dataUri);
                setSolution('');
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUri = canvas.toDataURL('image/jpeg');
                setImagePreview(dataUri);
                setImageDataUri(dataUri);
                setSolution('');
                setError(null);
            }
        }
    };

    const handleSubmit = async () => {
        if (!imageDataUri) {
            setError('Please upload or capture an image first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSolution('');

        const response = await solveQuestionFromImage({
            photoDataUri: imageDataUri,
            question: question,
        });

        if (response.success) {
            setSolution(response.data.solution);
        } else {
            setError(response.error);
        }

        setIsLoading(false);
    };

    const handleNewProblem = () => {
        setImagePreview(null);
        setImageDataUri(null);
        setQuestion('');
        setSolution('');
        setError(null);
        setIsLoading(false);
        // also reset file input if possible
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    }

    if (solution) {
        return (
             <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="w-6 h-6 text-accent" /> AI Generated Solution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Your Problem:</h3>
                        <Image src={imagePreview!} alt="Problem" width={400} height={300} className="rounded-md border object-contain" />
                    </div>
                     <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                        <h3 className="font-semibold">Step-by-step Solution:</h3>
                        <p>{solution}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleNewProblem}>Solve Another Problem</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Solve a Problem from an Image</CardTitle>
                <CardDescription>Upload a photo of a question, and our AI will provide a step-by-step solution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs defaultValue="upload" className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><FileImage className="mr-2" /> Upload File</TabsTrigger>
                        <TabsTrigger value="webcam"><Camera className="mr-2"/> Use Webcam</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                        <div className="mt-4">
                            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                Select an image file
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, or JPEG</p>
                                    </div>
                                    <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>

                    </TabsContent>
                     <TabsContent value="webcam">
                        <div className="mt-4 flex flex-col items-center gap-4">
                            <div className="w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                               {hasCameraPermission === null && <p className="text-muted-foreground">Requesting camera access...</p>}
                               {hasCameraPermission === false && <p className="text-destructive-foreground p-4">Camera access denied. Please enable in your browser settings.</p>}
                                <video ref={videoRef} className={`w-full h-full object-cover ${hasCameraPermission ? '' : 'hidden'}`} autoPlay muted playsInline />
                                <canvas ref={canvasRef} className="hidden" />
                            </div>
                             <Button onClick={handleCapture} disabled={!hasCameraPermission || isLoading}>
                                <Camera className="mr-2" />
                                Capture Photo
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                 {imagePreview && (
                    <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Image Preview:</h4>
                        <Image src={imagePreview} alt="Selected problem" width={300} height={200} className="rounded-md border object-contain" />
                    </div>
                )}
                
                <div>
                    <label htmlFor="question" className="block text-sm font-medium mb-1">Optional: Add a specific question (e.g., "Solve for x")</label>
                    <Textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type any additional context here..."
                        className="resize-none"
                    />
                </div>

                {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={!imageDataUri || isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Solving...' : 'Solve Problem'}
                </Button>
            </CardFooter>
        </Card>
    );
}
