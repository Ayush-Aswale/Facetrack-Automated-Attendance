import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RecognitionResult {
  name: string;
  confidence: number;
  userId: string;
}

const Attendance = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCapturing(false);
    }
  }, []);

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const imageData = canvasRef.current.toDataURL("image/jpeg");

    try {
      // Fetch all registered users
      const { data: users, error } = await supabase.from("users").select("*");

      if (error) throw error;

      // Simple matching based on image similarity (simplified for demo)
      // In production, use actual face recognition algorithms
      if (users && users.length > 0) {
        // For demo, randomly select a user (replace with actual face matching)
        const matchedUser = users[Math.floor(Math.random() * users.length)];
        
        setRecognitionResult({
          name: matchedUser.name,
          confidence: 95,
          userId: matchedUser.id,
        });

        // Mark attendance
        const { error: attendanceError } = await supabase.from("attendance").insert({
          user_id: matchedUser.id,
          status: "present",
        });

        if (attendanceError) throw attendanceError;

        toast.success(`Attendance marked for ${matchedUser.name}!`);
      } else {
        setRecognitionResult(null);
        toast.error("No matching face found in database");
      }
    } catch (error) {
      console.error("Error recognizing face:", error);
      toast.error("Failed to process face recognition");
    } finally {
      setIsProcessing(false);
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Mark Attendance
          </h1>
          <p className="text-muted-foreground">
            Scan face to automatically record attendance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-6 w-6 text-primary" />
                  <span>Face Recognition Scanner</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    {!isCapturing && (
                      <div className="text-center p-8">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Position face in frame and click scan
                        </p>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className={`w-full h-full object-cover ${
                        isCapturing ? "block" : "hidden"
                      }`}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  <div className="flex space-x-3">
                    {!isCapturing ? (
                      <Button
                        onClick={startCamera}
                        className="flex-1"
                        size="lg"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Start Scanner
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={captureAndRecognize}
                          className="flex-1"
                          size="lg"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Scan Face"}
                        </Button>
                        <Button
                          onClick={stopCamera}
                          variant="outline"
                          size="lg"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recognition Result</CardTitle>
              </CardHeader>
              <CardContent>
                {recognitionResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center p-4 bg-accent/10 rounded-lg">
                      <CheckCircle className="h-12 w-12 text-accent" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-foreground mb-1">
                        {recognitionResult.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Confidence: {recognitionResult.confidence}%
                      </p>
                      <div className="px-4 py-2 bg-accent/10 rounded-full inline-block">
                        <span className="text-accent font-medium">
                          Attendance Marked
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No face recognized yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Scan a face to see results here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
