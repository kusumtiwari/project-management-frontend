import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, Shield, User, AlertCircle } from 'lucide-react';
import { APIENDPOINTS, getAPIAUTHHEADERS } from '@/constants/APIEndpoints';

interface UserData {
  _id: string;
  username: string;
  email: string;
  userType: 'admin' | 'member';
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isVerified: boolean;
  hasCompletedSetup: boolean;
  createdBy?: {
    username: string;
    email: string;
  };
  teams: Array<{
    teamId: {
      _id: string;
      name: string;
    };
    teamName: string;
    role: string;
    joinedAt: string;
  }>;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, userTypeFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(APIENDPOINTS.SUPERADMIN.GET_USERS, {
        method: 'GET',
        headers: getAPIAUTHHEADERS(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // User type filter
    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(user => user.userType === userTypeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.isVerified);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => !user.isVerified);
      }
    }

    setFilteredUsers(filtered);
  };

  const getUserTypeIcon = (userType: string, isAdmin: boolean) => {
    if (isAdmin) {
      return <Shield className="h-4 w-4 text-blue-600" />;
    }
    return <User className="h-4 w-4 text-gray-600" />;
  };

  const getUserTypeBadge = (userType: string, isAdmin: boolean) => {
    if (isAdmin) {
      return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
    }
    return <Badge variant="outline">Member</Badge>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold">Error Loading Users</h1>
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.isAdmin).length}</p>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => !u.isAdmin).length}</p>
                <p className="text-sm text-gray-600">Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All User Types</SelectItem>
                <SelectItem value="admin">Admins Only</SelectItem>
                <SelectItem value="member">Members Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">
                {users.length === 0 
                  ? "No users have been created yet."
                  : "No users match the current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user._id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getUserTypeIcon(user.userType, user.isAdmin)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{user.username}</h3>
                        {getUserTypeBadge(user.userType, user.isAdmin)}
                        <Badge variant={user.isVerified ? "default" : "destructive"}>
                          {user.isVerified ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                        {user.createdBy && (
                          <span>Created by: {user.createdBy.username}</span>
                        )}
                        <span>Teams: {user.teams.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {user.teams.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Team Memberships:</p>
                        {user.teams.slice(0, 2).map((team, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            {team.teamId?.name || team.teamName} ({team.role})
                          </div>
                        ))}
                        {user.teams.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{user.teams.length - 2} more teams
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Results Summary */}
      {users.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 text-center">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;