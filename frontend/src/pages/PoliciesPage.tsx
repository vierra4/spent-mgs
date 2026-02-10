import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '@/lib/api';
import { Policy } from '@/types/spend';
import { formatDate } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Plus, 
  Shield, 
  Code, 
  Zap, 
  AlertTriangle, 
  Trash2,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function PoliciesPage() {
  const { user } = useAuth0();
  const { getPolicies, createPolicy, togglePolicy, deletePolicy } = useApi();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    active: true,
    rulesJson: '{\n  "condition": {\n    "amount": { "gt": 500 }\n  },\n  "action": "flag_for_review"\n}',
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setIsLoading(true);
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (error) {
      toast.error('Could not load policy engine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (policy: Policy) => {
    const originalStatus = policy.active;
    try {
      // Optimistic Update
      setPolicies(prev => prev.map(p => p.id === policy.id ? { ...p, active: !p.active } : p));
      await togglePolicy(policy.id);
      toast.success(`Policy ${!originalStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      setPolicies(prev => prev.map(p => p.id === policy.id ? { ...p, active: originalStatus } : p));
      toast.error('Failed to update policy status');
    }
  };

  const handleSave = async () => {
    if (!user?.sub) return;
    
    try {
      const parsedRules = JSON.parse(newPolicy.rulesJson);
      setIsSubmitting(true);
      
      await createPolicy({
        ...newPolicy,
        rules: [parsedRules],
        createdBy: user.sub,
      });

      toast.success('New policy deployed');
      setIsDialogOpen(false);
      setNewPolicy({
        name: '',
        description: '',
        active: true,
        rulesJson: '{\n  "condition": {},\n  "action": {}\n}',
      });
      loadPolicies();
    } catch (e) {
      toast.error(e instanceof SyntaxError ? 'Invalid JSON syntax' : 'Deployment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout 
      title="Compliance Engine"
      actions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0047AB] hover:bg-[#003d94] shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-[#0047AB]" />
                Define New Policy
              </DialogTitle>
              <DialogDescription>
                Expenses matching these rules will be automatically processed.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  className="col-span-3" 
                  placeholder="High Value Alert"
                  value={newPolicy.name}
                  onChange={e => setNewPolicy(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desc" className="text-right">Description</Label>
                <Input 
                  id="desc" 
                  className="col-span-3" 
                  placeholder="Flags expenses over $500"
                  value={newPolicy.description}
                  onChange={e => setNewPolicy(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-400 uppercase">Logic Configuration (JSON)</Label>
                  <Button variant="ghost" size="xs" className="text-[10px] h-6" onClick={() => {
                    setNewPolicy(p => ({...p, rulesJson: '{\n  "condition": {\n    "category": "Travel"\n  },\n  "action": "auto_approve"\n}'}))
                  }}>
                    Load Template
                  </Button>
                </div>
                <Textarea 
                  className="font-mono text-xs min-h-[150px] bg-slate-950 text-emerald-400 border-slate-800"
                  value={newPolicy.rulesJson}
                  onChange={e => setNewPolicy(p => ({ ...p, rulesJson: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSave} 
                disabled={isSubmitting || !newPolicy.name}
                className="bg-[#0047AB]"
              >
                {isSubmitting ? "Deploying..." : "Deploy Policy"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <Zap className="h-5 w-5 text-[#0047AB]" />
          <p className="text-sm text-blue-800">
            <strong>Pro Tip:</strong> Active policies are evaluated in real-time as soon as an expense is uploaded via OCR.
          </p>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="h-40 w-full bg-slate-100 animate-pulse rounded-xl" />
          ) : policies.length === 0 ? (
            <EmptyPolicies />
          ) : (
            policies.map((policy) => (
              <Card key={policy.id} className={cn(
                "transition-all border-slate-200 overflow-hidden",
                !policy.active && "opacity-60 grayscale-[0.5]"
              )}>
                <div className="flex items-stretch">
                  <div className={cn(
                    "w-1.5",
                    policy.active ? "bg-[#0047AB]" : "bg-slate-300"
                  )} />
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{policy.name}</h3>
                          {policy.active && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">
                              Live
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{policy.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                          <Switch 
                            checked={policy.active} 
                            onCheckedChange={() => handleToggle(policy)} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rule Definition</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <pre className="text-xs font-mono text-slate-600">
                          {JSON.stringify(policy.rules, null, 2)}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 italic">
                        Deployed on {formatDate(policy.created_at)}
                      </span>
                      <Button variant="ghost" size="xs" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Sub-components
function Badge({ children, className }: any) {
  return (
    <span className={cn("px-2 py-0.5 rounded-full border font-bold uppercase tracking-tight", className)}>
      {children}
    </span>
  );
}

function EmptyPolicies() {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100">
      <Shield className="h-12 w-12 text-slate-200 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-900">No Guardrails Set</h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
        Establish spending limits and auto-approval rules to reduce manual overhead.
      </p>
    </div>
  );
}