
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { getAllUsers, getAllAdAccounts, updateUserRole, UserProfile } from "@/services/adAccountService";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Shield, ShieldAlert, User as UserIcon, Users } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        const accountsData = await getAllAdAccounts();
        setAdAccounts(accountsData);
      } catch (error: any) {
        console.error("Error fetching admin data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load admin data",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleUpdateRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      setProcessingUser(userId);
      await updateUserRole(userId, newRole);
      
      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast({
        title: "Role Updated",
        description: `User's role has been updated to ${newRole}.`,
      });
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user role",
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <Tabs defaultValue="users">
            <TabsList className="mb-8">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Platform Connections
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No users found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                                  {user.full_name || 'Unnamed User'}
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <span className={`font-medium ${
                                  user.role === 'admin' ? 'text-primary' : 'text-muted-foreground'
                                }`}>
                                  {user.role === 'admin' ? 'Administrator' : 'User'}
                                </span>
                              </TableCell>
                              <TableCell>{formatDate(user.created_at)}</TableCell>
                              <TableCell>
                                {user.role === 'user' ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateRole(user.id, 'admin')}
                                    disabled={processingUser === user.id}
                                  >
                                    {processingUser === user.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                      <Shield className="h-4 w-4 mr-2" />
                                    )}
                                    Make Admin
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateRole(user.id, 'user')}
                                    disabled={processingUser === user.id}
                                  >
                                    {processingUser === user.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                      <ShieldAlert className="h-4 w-4 mr-2" />
                                    )}
                                    Remove Admin
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Connections</CardTitle>
                  <CardDescription>
                    View all user connections to advertising platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : adAccounts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No platform connections found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead>Account ID</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {adAccounts.map((account) => (
                            <TableRow key={account.id}>
                              <TableCell>
                                {account.users_meta?.email || 'Unknown User'}
                              </TableCell>
                              <TableCell className="capitalize">
                                {account.platform}
                              </TableCell>
                              <TableCell>
                                {account.account_id || 'N/A'}
                              </TableCell>
                              <TableCell>
                                {formatDate(account.created_at)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
