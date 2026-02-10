import { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useGetAllPricingPlans,
  useCreatePricingPlan,
  useUpdatePricingPlan,
  useDeletePricingPlan,
} from '../../hooks/useQueries';
import type { PricingPlan } from '../../backend';

interface PricingPlansAdminPanelProps {
  embedded?: boolean;
}

interface PlanFormData {
  name: string;
  description: string;
  priceCents: string;
  durationDays: string;
  features: string;
}

export default function PricingPlansAdminPanel({ embedded = false }: PricingPlansAdminPanelProps) {
  const { data: plans = [], isLoading } = useGetAllPricingPlans();
  const createMutation = useCreatePricingPlan();
  const updateMutation = useUpdatePricingPlan();
  const deleteMutation = useDeletePricingPlan();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    priceCents: '',
    durationDays: '30',
    features: '',
  });
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      priceCents: '',
      durationDays: '30',
      features: '',
    });
    setEditingPlan(null);
    setError(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      priceCents: plan.priceCents.toString(),
      durationDays: plan.durationDays.toString(),
      features: plan.features.join('\n'),
    });
    setError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Plan name is required');
      return;
    }
    if (!formData.priceCents.trim() || isNaN(Number(formData.priceCents))) {
      setError('Valid price is required');
      return;
    }
    if (!formData.durationDays.trim() || isNaN(Number(formData.durationDays))) {
      setError('Valid duration is required');
      return;
    }

    const features = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (features.length === 0) {
      setError('At least one feature is required');
      return;
    }

    try {
      if (editingPlan) {
        await updateMutation.mutateAsync({
          id: editingPlan.id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          priceCents: BigInt(formData.priceCents),
          durationDays: BigInt(formData.durationDays),
          features,
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          description: formData.description.trim(),
          priceCents: BigInt(formData.priceCents),
          durationDays: BigInt(formData.durationDays),
          features,
        });
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save plan. Please try again.');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete plan. Please try again.');
    }
  };

  return (
    <div>
      {/* Add New Plan Button */}
      <div className="mb-6">
        <Button onClick={openCreateForm} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Plans List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No pricing plans yet. Create your first plan to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.id.toString()} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">{plan.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => openEditForm(plan)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(plan.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-2xl font-bold">Rs {Number(plan.priceCents) / 100}</span>
                    <span className="text-muted-foreground ml-2">
                      / {Number(plan.durationDays)} days
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Features:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}</DialogTitle>
            <DialogDescription>
              {editingPlan
                ? 'Update the details of your pricing plan.'
                : 'Fill in the details to create a new pricing plan.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Starter, Pro, Enterprise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Perfect for personal projects"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceCents">Price (in cents) *</Label>
                <Input
                  id="priceCents"
                  type="number"
                  value={formData.priceCents}
                  onChange={(e) => setFormData({ ...formData, priceCents: e.target.value })}
                  placeholder="e.g., 8000 for Rs 80"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.priceCents && !isNaN(Number(formData.priceCents))
                    ? `Rs ${Number(formData.priceCents) / 100}`
                    : 'Enter price in cents'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationDays">Duration (days) *</Label>
                <Input
                  id="durationDays"
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line) *</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="2 GB RAM&#10;2 CPU Cores&#10;50GB NVMe Storage&#10;Free SSL Certificate"
                rows={8}
              />
              <p className="text-xs text-muted-foreground">Enter each feature on a new line</p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingPlan ? (
                  'Update Plan'
                ) : (
                  'Create Plan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
