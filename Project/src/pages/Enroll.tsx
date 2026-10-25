import { useState, useRef, useCallback } from "react";
import { Camera, User, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Enroll = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
        toast.success("Image captured successfully!");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !capturedImage) {
      toast.error("Please fill in name and capture an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("users").insert({
        name,
        email: email || null,
        department: department || null,
        face_encoding: capturedImage,
      });

      if (error) throw error;

      toast.success("User enrolled successfully!");
      setName("");
      setEmail("");
      setDepartment("");
      setCapturedImage(null);
    } catch (error) {
      console.error("Error enrolling user:", error);
      toast.error("Failed to enroll user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Enroll New User
          </h1>
          <p className="text-muted-foreground">
            Register a new face for attendance tracking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-primary" />
                <span>Capture Face</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  {!isCapturing && !capturedImage && (
                    <div className="text-center p-8">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click start camera to begin
                      </p>
                    </div>
                  )}
                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
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
                  {!isCapturing && !capturedImage && (
                    <Button
                      onClick={startCamera}
                      className="flex-1"
                      variant="default"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  )}
                  {isCapturing && (
                    <>
                      <Button
                        onClick={captureImage}
                        className="flex-1"
                        variant="default"
                      >
                        Capture
                      </Button>
                      <Button
                        onClick={stopCamera}
                        className="flex-1"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {capturedImage && (
                    <Button
                      onClick={() => {
                        setCapturedImage(null);
                        startCamera();
                      }}
                      className="flex-1"
                      variant="outline"
                    >
                      Retake
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-6 w-6 text-primary" />
                <span>User Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Department</span>
                  </Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department name"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !capturedImage || !name}
                >
                  {isSubmitting ? "Enrolling..." : "Enroll User"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
