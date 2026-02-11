import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Shield, Trash2, UserX, UserCheck, AlertCircle } from 'lucide-react';
import { APIENDPOINTS, getAPIAUTHHEADERS } from '@/constants/APIEndpoints';
import { toast } from 'sonner';

interface Admin {
  id: string;
  username: string;
  email: string;
  userType: string;
  createdBy?: {
    username: string;
    email: string;
  };
  createdAt: string;
  isVerified: boolean;
}

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(APIENDPOINTS.SUPERADMIN.GET_ADMINS, {
        method: 'GET',
        headers: getAPIAUTHHEADERS(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      if (data.success) {
        setAdmins(data.admins);
      } else {
        throw new Error(data.message || 'Failed to fetch admins');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setCreateLoading(true);
      const response = await fetch(APIENDPOINTS.SUPERADMIN.CREATE_ADMIN, {
        method: 'POST',
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Admin created successfully');
        setNewAdmin({ username: '', email: '', password: '' });
        setIsCreateDialogOpen(false);
        fetchAdmins(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to create admin');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const response = await fetch(`${APIENDPOINTS.SUPERADMIN.DELETE_ADMIN}${adminId}`, {
        method: 'DELETE',
        headers: getAPIAUTHHEADERS(),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Admin deleted successfully');
        fetchAdmins(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to delete admin');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleToggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${APIENDPOINTS.SUPERADMIN.UPDATE_ADMIN_STATUS}${adminId}/status`, {
        method: 'PUT',
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchAdmins(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to update admin status');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Error Loading Admins</h1>
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Admin Management</h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
              <DialogDescription>
                Create a new administrator account with full admin privileges.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Admin'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {admins.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Admins Found</h3>
              <p className="text-gray-600 mb-4">Create your first admin to get started.</p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create First Admin</Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          admins.map((admin) => (
            <Card key={admin.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{admin.username}</h3>
                        <Badge variant={admin.isVerified ? "default" : "destructive"}>
                          {admin.isVerified ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{admin.email}</p>
                      <p className="text-sm text-gray-500">
                        Created on {new Date(admin.createdAt).toLocaleDateString()}
                        {admin.createdBy && ` by ${admin.createdBy.username}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAdminStatus(admin.id, admin.isVerified)}
                      className="flex items-center gap-2"
                    >
                      {admin.isVerified ? (
                        <>
                          <UserX className="h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Admin</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {admin.username}? This action will also delete all teams, projects, and tasks created by this admin. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Admin
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminManagement;