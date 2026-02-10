import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Users,
  Building2,
  Wallet,
  Settings,
  UserPlus,
  Mail,
  Shield,
  DollarSign,
  Briefcase,
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
  Send,
  Clock,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/spend';
import { formatCurrency } from '@/lib/constants';

// Mock data for users
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@company.com', role: 'employee' as UserRole, department: 'Engineering', status: 'active', joinDate: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'manager' as UserRole, department: 'Engineering', status: 'active', joinDate: '2023-06-20' },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'finance' as UserRole, department: 'Finance', status: 'active', joinDate: '2023-03-10' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@company.com', role: 'admin' as UserRole, department: 'Operations', status: 'active', joinDate: '2022-11-05' },
  { id: '5', name: 'Tom Brown', email: 'tom@company.com', role: 'employee' as UserRole, department: 'Marketing', status: 'pending', joinDate: '2024-03-01' },
];

const mockDepartments = [
  { id: '1', name: 'Engineering', budget: 50000, spent: 32450, manager: 'Jane Smith', headcount: 12 },
  { id: '2', name: 'Marketing', budget: 30000, spent: 18200, manager: 'Lisa Chen', headcount: 6 },
  { id: '3', name: 'Finance', budget: 15000, spent: 8900, manager: 'Mike Johnson', headcount: 4 },
  { id: '4', name: 'Operations', budget: 25000, spent: 21300, manager: 'Sarah Williams', headcount: 8 },
  { id: '5', name: 'Sales', budget: 40000, spent: 28750, manager: 'David Lee', headcount: 10 },
];

const mockPendingInvites = [
  { id: '1', email: 'newuser@company.com', role: 'employee', invitedBy: 'Sarah Williams', invitedAt: '2024-03-10', status: 'pending' },
  { id: '2', email: 'contractor@external.com', role: 'employee', invitedBy: 'Jane Smith', invitedAt: '2024-03-08', status: 'pending' },
];

export function SettingsPage() {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<typeof mockDepartments[0] | null>(null);

  // Form states
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'employee' as UserRole, department: '' });
  const [departmentForm, setDepartmentForm] = useState({ name: '', budget: '', manager: '' });

  const isAdmin = hasRole(['admin']);
  const isManagerOrAbove = hasRole(['manager', 'finance', 'admin']);

  const handleInviteUser = () => {
    toast.success(`Invitation sent to ${inviteForm.email}`);
    setInviteDialogOpen(false);
    setInviteForm({ email: '', role: 'employee', department: '' });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    toast.success(`Role updated successfully`);
  };

  const handleDeactivateUser = (userId: string) => {
    toast.success('User deactivated');
  };

  const handleCreateDepartment = () => {
    toast.success(`Department "${departmentForm.name}" created`);
    setDepartmentDialogOpen(false);
    setDepartmentForm({ name: '', budget: '', manager: '' });
  };

  const handleUpdateBudget = (departmentId: string, newBudget: number) => {
    toast.success('Budget updated successfully');
    setBudgetDialogOpen(false);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'finance': return 'bg-emerald-100 text-emerald-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>;
    if (status === 'pending') return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
    return <Badge className="bg-slate-100 text-slate-700">Inactive</Badge>;
  };

  const getBudgetUsageColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1 h-auto">
            {isAdmin && (
              <TabsTrigger value="users" className="flex items-center gap-2 px-4 py-2">
                <Users className="h-4 w-4" />
                User Management
              </TabsTrigger>
            )}
            {isManagerOrAbove && (
              <TabsTrigger value="departments" className="flex items-center gap-2 px-4 py-2">
                <Building2 className="h-4 w-4" />
                Departments
              </TabsTrigger>
            )}
            {isManagerOrAbove && (
              <TabsTrigger value="budgets" className="flex items-center gap-2 px-4 py-2">
                <Wallet className="h-4 w-4" />
                Budget Caps
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="onboarding" className="flex items-center gap-2 px-4 py-2">
                <UserPlus className="h-4 w-4" />
                Onboarding
              </TabsTrigger>
            )}
            <TabsTrigger value="spending" className="flex items-center gap-2 px-4 py-2">
              <DollarSign className="h-4 w-4" />
              Spending Rules
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2 px-4 py-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          {isAdmin && (
            <TabsContent value="users" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">User Management</CardTitle>
                    <CardDescription>Manage team members, roles, and permissions</CardDescription>
                  </div>
                  <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#0047AB] hover:bg-[#003d94]">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Invite New User</DialogTitle>
                        <DialogDescription>
                          Send an invitation email to add a new team member
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="user@company.com"
                            value={inviteForm.email}
                            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={inviteForm.role}
                            onValueChange={(value) => setInviteForm({ ...inviteForm, role: value as UserRole })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select
                            value={inviteForm.department}
                            onValueChange={(value) => setInviteForm({ ...inviteForm, department: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockDepartments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleInviteUser} className="bg-[#0047AB] hover:bg-[#003d94]">
                          <Send className="h-4 w-4 mr-2" />
                          Send Invite
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-slate-200 text-sm">
                                  {u.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-slate-900">{u.name}</p>
                                <p className="text-sm text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={u.role}
                              onValueChange={(value) => handleRoleChange(u.id, value as UserRole)}
                            >
                              <SelectTrigger className="w-28 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{u.department}</TableCell>
                          <TableCell>{getStatusBadge(u.status)}</TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(u.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Reset Link
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeactivateUser(u.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Departments Tab */}
          {isManagerOrAbove && (
            <TabsContent value="departments" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Departments</CardTitle>
                    <CardDescription>Manage organizational departments and their budgets</CardDescription>
                  </div>
                  {isAdmin && (
                    <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#0047AB] hover:bg-[#003d94]">
                          <Building2 className="h-4 w-4 mr-2" />
                          Add Department
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Create Department</DialogTitle>
                          <DialogDescription>
                            Add a new department to your organization
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="deptName">Department Name</Label>
                            <Input
                              id="deptName"
                              placeholder="e.g., Product Development"
                              value={departmentForm.name}
                              onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deptBudget">Monthly Budget</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                id="deptBudget"
                                type="number"
                                className="pl-9"
                                placeholder="50000"
                                value={departmentForm.budget}
                                onChange={(e) => setDepartmentForm({ ...departmentForm, budget: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deptManager">Department Manager</Label>
                            <Select
                              value={departmentForm.manager}
                              onValueChange={(value) => setDepartmentForm({ ...departmentForm, manager: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select manager" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockUsers.filter(u => u.role === 'manager' || u.role === 'admin').map((u) => (
                                  <SelectItem key={u.id} value={u.id}>
                                    {u.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDepartmentDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateDepartment} className="bg-[#0047AB] hover:bg-[#003d94]">
                            Create Department
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Headcount</TableHead>
                        <TableHead>Monthly Budget</TableHead>
                        <TableHead>Spent</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDepartments.map((dept) => (
                        <TableRow key={dept.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Briefcase className="h-4 w-4 text-slate-600" />
                              </div>
                              <span className="font-medium text-slate-900">{dept.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">{dept.manager}</TableCell>
                          <TableCell className="text-slate-600">{dept.headcount} members</TableCell>
                          <TableCell className="font-mono">{formatCurrency(dept.budget)}</TableCell>
                          <TableCell className={`font-mono ${getBudgetUsageColor(dept.spent, dept.budget)}`}>
                            {formatCurrency(dept.spent)}
                          </TableCell>
                          <TableCell className="font-mono text-slate-600">
                            {formatCurrency(dept.budget - dept.spent)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setSelectedDepartment(dept);
                                  setBudgetDialogOpen(true);
                                }}>
                                  <Wallet className="h-4 w-4 mr-2" />
                                  Adjust Budget
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Department
                                </DropdownMenuItem>
                                {isAdmin && (
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Budget Caps Tab */}
          {isManagerOrAbove && (
            <TabsContent value="budgets" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Organization Budget</CardTitle>
                    <CardDescription>Overall spending limits for the organization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Monthly Budget</p>
                        <p className="text-2xl font-bold font-mono text-slate-900">{formatCurrency(160000)}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Spent This Month</p>
                        <p className="text-2xl font-bold font-mono text-[#0047AB]">{formatCurrency(109600)}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Budget Usage</span>
                        <span className="font-medium">68.5%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0047AB] rounded-full" style={{ width: '68.5%' }} />
                      </div>
                    </div>
                    {isAdmin && (
                      <Button variant="outline" className="w-full">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Organization Budget
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Per-Employee Limits</CardTitle>
                    <CardDescription>Default spending caps for individual employees</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Daily Limit</p>
                          <p className="text-sm text-slate-500">Max per single expense</p>
                        </div>
                        <span className="font-mono text-lg">{formatCurrency(500)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Weekly Limit</p>
                          <p className="text-sm text-slate-500">Cumulative weekly spend</p>
                        </div>
                        <span className="font-mono text-lg">{formatCurrency(2000)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Monthly Limit</p>
                          <p className="text-sm text-slate-500">Cumulative monthly spend</p>
                        </div>
                        <span className="font-mono text-lg">{formatCurrency(5000)}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button variant="outline" className="w-full">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Employee Limits
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Category Budgets</CardTitle>
                    <CardDescription>Set spending limits by expense category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'Travel', budget: 40000, spent: 28500, icon: '✈️' },
                        { name: 'Meals', budget: 20000, spent: 15200, icon: '🍽️' },
                        { name: 'Software', budget: 35000, spent: 22100, icon: '💻' },
                        { name: 'Equipment', budget: 25000, spent: 18000, icon: '🔧' },
                        { name: 'Office Supplies', budget: 10000, spent: 6800, icon: '📎' },
                        { name: 'Marketing', budget: 15000, spent: 9500, icon: '📢' },
                        { name: 'Professional Services', budget: 20000, spent: 12000, icon: '👔' },
                        { name: 'Other', budget: 5000, spent: 2500, icon: '📦' },
                      ].map((cat) => (
                        <div key={cat.name} className="p-4 border rounded-lg hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{cat.icon}</span>
                            <span className="font-medium text-slate-900">{cat.name}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Budget</span>
                              <span className="font-mono">{formatCurrency(cat.budget)}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  (cat.spent / cat.budget) >= 0.9 ? 'bg-red-500' :
                                  (cat.spent / cat.budget) >= 0.75 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min((cat.spent / cat.budget) * 100, 100)}%` }}
                              />
                            </div>
                            <p className={`text-xs ${getBudgetUsageColor(cat.spent, cat.budget)}`}>
                              {formatCurrency(cat.spent)} spent ({Math.round((cat.spent / cat.budget) * 100)}%)
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Onboarding Tab */}
          {isAdmin && (
            <TabsContent value="onboarding" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Pending Invitations</CardTitle>
                    <CardDescription>Users who haven't completed their registration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockPendingInvites.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Invited By</TableHead>
                            <TableHead>Sent</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPendingInvites.map((invite) => (
                            <TableRow key={invite.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-slate-400" />
                                  <span>{invite.email}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getRoleBadgeColor(invite.role as UserRole)}>
                                  {invite.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-600">{invite.invitedBy}</TableCell>
                              <TableCell className="text-slate-600">
                                {new Date(invite.invitedAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm">
                                    <Send className="h-3 w-3 mr-1" />
                                    Resend
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <X className="h-3 w-3 mr-1" />
                                    Revoke
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                        <p>No pending invitations</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Onboarding Checklist</CardTitle>
                    <CardDescription>Default tasks for new employees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { label: 'Complete profile setup', enabled: true },
                        { label: 'Review spending policies', enabled: true },
                        { label: 'Submit first expense (test)', enabled: false },
                        { label: 'Set up payment method', enabled: true },
                        { label: 'Watch training video', enabled: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                          <span className="text-sm text-slate-700">{item.label}</span>
                          <Switch checked={item.enabled} />
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Onboarding Flow
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Spending Rules Tab */}
          <TabsContent value="spending" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Approval Thresholds</CardTitle>
                  <CardDescription>Configure when manager approval is required</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Auto-approve under</p>
                        <p className="text-sm text-slate-500">Expenses below this amount skip approval</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <Input type="number" className="w-24 text-right font-mono" defaultValue="100" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Manager approval up to</p>
                        <p className="text-sm text-slate-500">Manager can approve expenses up to</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <Input type="number" className="w-24 text-right font-mono" defaultValue="5000" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Finance approval required</p>
                        <p className="text-sm text-slate-500">Expenses above this need Finance approval</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <Input type="number" className="w-24 text-right font-mono" defaultValue="5000" />
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button className="w-full bg-[#0047AB] hover:bg-[#003d94]">
                      Save Thresholds
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Receipt Requirements</CardTitle>
                  <CardDescription>Configure when receipts are mandatory</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Require receipts</p>
                        <p className="text-sm text-slate-500">For all expenses</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Receipt threshold</p>
                        <p className="text-sm text-slate-500">Required for expenses over</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <Input type="number" className="w-20 text-right font-mono" defaultValue="25" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Allow digital receipts</p>
                        <p className="text-sm text-slate-500">Screenshots and email confirmations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">OCR extraction</p>
                        <p className="text-sm text-slate-500">Auto-fill from receipt images</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Category Rules</CardTitle>
                  <CardDescription>Enable or disable spending categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Travel', enabled: true },
                      { name: 'Meals & Entertainment', enabled: true },
                      { name: 'Software', enabled: true },
                      { name: 'Equipment', enabled: true },
                      { name: 'Office Supplies', enabled: true },
                      { name: 'Marketing', enabled: true },
                      { name: 'Professional Services', enabled: false },
                      { name: 'Other', enabled: true },
                    ].map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-700">{cat.name}</span>
                        <Switch defaultChecked={cat.enabled} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Expense Policies</CardTitle>
                  <CardDescription>Global spending rules and restrictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Weekend spending</p>
                        <p className="text-sm text-slate-500">Allow expenses on weekends</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Future-dated expenses</p>
                        <p className="text-sm text-slate-500">Allow pre-booking travel etc.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Expense age limit</p>
                        <p className="text-sm text-slate-500">Max days old for submission</p>
                      </div>
                      <Input type="number" className="w-20 text-right font-mono" defaultValue="90" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Duplicate detection</p>
                        <p className="text-sm text-slate-500">Flag potential duplicates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Organization Profile</CardTitle>
                  <CardDescription>Basic organization information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" defaultValue="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgDomain">Email Domain</Label>
                    <Input id="orgDomain" defaultValue="acme.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="america-new_york">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-new_york">America/New York (EST)</SelectItem>
                        <SelectItem value="america-los_angeles">America/Los Angeles (PST)</SelectItem>
                        <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                        <SelectItem value="asia-tokyo">Asia/Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
                    <Select defaultValue="january">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="july">July</SelectItem>
                        <SelectItem value="october">October</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {isAdmin && (
                    <Button className="w-full bg-[#0047AB] hover:bg-[#003d94]">
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Currency & Locale</CardTitle>
                  <CardDescription>Default currency and formatting preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Enabled Currencies</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['USD', 'EUR', 'GBP', 'CAD', 'AUD'].map((curr) => (
                        <div key={curr} className="flex items-center gap-2">
                          <Switch defaultChecked={['USD', 'EUR', 'GBP'].includes(curr)} />
                          <span className="text-sm">{curr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Notifications</CardTitle>
                  <CardDescription>Configure email and in-app notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Email notifications</p>
                        <p className="text-sm text-slate-500">Send email for important events</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Approval reminders</p>
                        <p className="text-sm text-slate-500">Remind approvers of pending items</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Budget alerts</p>
                        <p className="text-sm text-slate-500">Alert when budget thresholds reached</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-slate-900">Weekly digest</p>
                        <p className="text-sm text-slate-500">Summary of spending activity</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Integrations</CardTitle>
                  <CardDescription>Connect external services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'QuickBooks', connected: true, icon: '📊' },
                      { name: 'Xero', connected: false, icon: '📈' },
                      { name: 'Slack', connected: true, icon: '💬' },
                      { name: 'Google Workspace', connected: true, icon: '📧' },
                      { name: 'Microsoft 365', connected: false, icon: '📝' },
                    ].map((int) => (
                      <div key={int.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{int.icon}</span>
                          <span className="font-medium text-slate-900">{int.name}</span>
                        </div>
                        {int.connected ? (
                          <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
                        ) : (
                          <Button variant="outline" size="sm">Connect</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Budget Dialog */}
        <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adjust Budget</DialogTitle>
              <DialogDescription>
                Update the monthly budget for {selectedDepartment?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Budget</Label>
                <p className="text-2xl font-bold font-mono">{formatCurrency(selectedDepartment?.budget || 0)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newBudget">New Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="newBudget"
                    type="number"
                    className="pl-9"
                    defaultValue={selectedDepartment?.budget}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBudgetDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateBudget(selectedDepartment?.id || '', 0)} className="bg-[#0047AB] hover:bg-[#003d94]">
                Update Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
