
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { completePlatformAuth, AdPlatform } from "@/services/adAccountService";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state'); // Some OAuth providers send state
        const platform = sessionStorage.getItem('auth_platform') as AdPlatform;
        
        if (!code) {
          throw new Error("Authorization code not found in the callback URL");
        }
        
        if (!platform) {
          throw new Error("Could not determine the platform for this authentication");
        }
        
        // Complete the authentication process
        await completePlatformAuth(platform, code);
        
        // Clear the stored platform
        sessionStorage.removeItem('auth_platform');
        
        toast({
          title: "Authentication successful",
          description: `Your ${platform} account has been connected.`,
        });
        
        // Redirect to the main page
        navigate("/");
      } catch (err: any) {
        console.error("Authentication callback error:", err);
        setError(err.message || "Failed to complete authentication");
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: err.message || "Failed to connect your account. Please try again.",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    handleCallback();
  }, [location, navigate, toast]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {isProcessing ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-semibold mb-2">Completing Authentication</h1>
            <p className="text-muted-foreground">
              Please wait while we finish connecting your account...
            </p>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-semibold mb-2 text-destructive">Authentication Failed</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              className="text-primary hover:underline" 
              onClick={() => navigate("/")}
            >
              Return to Dashboard
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-2 text-primary">Success!</h1>
            <p className="text-muted-foreground mb-4">
              Your account has been connected successfully.
            </p>
            <p>
              Redirecting you to the dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
