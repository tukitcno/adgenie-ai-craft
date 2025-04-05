
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { getAdCampaigns, AdCampaign, getImageUrl } from "@/services/adService";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await getAdCampaigns(user.id);
        
        if (error) throw error;
        
        setCampaigns(data || []);
      } catch (error: any) {
        console.error("Error fetching campaigns:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your campaigns: " + error.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [user, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFirstHeadline = (campaign: AdCampaign) => {
    if (!campaign.ad_content) return 'No headline';
    
    const adContent = campaign.ad_content;
    return adContent.headlines?.[0] || 'No headline';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Ad Campaigns</h1>
            <Link to="/">
              <Button>Create New Ad</Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-pulse">Loading campaigns...</div>
            </div>
          ) : campaigns.length === 0 ? (
            <Card className="p-12 text-center">
              <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-6">
                Start creating your first AI-generated ad campaign
              </p>
              <Link to="/">
                <Button>Create Your First Campaign</Button>
              </Link>
            </Card>
          ) : (
            <div className="bg-card rounded-lg border shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Headline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>{formatDate(campaign.created_at || '')}</TableCell>
                      <TableCell className="capitalize">{campaign.platform}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {getFirstHeadline(campaign)}
                      </TableCell>
                      <TableCell>
                        <Link to={`/campaign/${campaign.id}`}>
                          <Button size="sm" variant="outline" className="flex gap-2 items-center">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 AdGenie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
