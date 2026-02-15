import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth0 } from '@auth0/auth0-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApi } from '@/lib/api';
import { SpendCategory, Currency } from '@/types/spend';
import { CATEGORY_LABELS, CURRENCY_SYMBOLS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, FileText, Loader2, Image as ImageIcon } from 'lucide-react';

const createSpendSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required').max(500),
});

type CreateSpendForm = z.infer<typeof createSpendSchema>;

export function CreateSpendPage() {
  const { user } = useAuth0();
  const { createSpend } = useApi();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSpendForm>({
    resolver: zodResolver(createSpendSchema),
    defaultValues: {
      currency: 'USD',
      category: 'other',
    },
  });

  const selectedCurrency = watch('currency');

  // Helper: Handle file selection and local preview
  const handleFile = (file: File) => {
    setUploadedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  // Cloudinary Upload Logic
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "spendflow_preset";
  
    if (!cloudName) throw new Error("Cloudinary cloud name missing");
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
  
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    const json = await res.json();
  
    if (!res.ok) {
      console.error("Cloudinary error:", json);
      throw new Error("Upload failed");
    }
  
    return json.secure_url;
  };
  const onSubmit = async (data: CreateSpendForm) => {
    if (!user) return;
  
    setIsSubmitting(true);
    const loadingToast = toast.loading('Processing your expense...');
  
    try {
      let receipt_url = undefined;
  
      if (uploadedFile) {
        toast.loading('Uploading receipt to Cloudinary...', { id: loadingToast });
        receipt_url = await uploadToCloudinary(uploadedFile);
      }
  
      const spend = await createSpend({
        amount: data.amount,
        currency: data.currency,
        category: data.category,
        description: data.description,
        spend_date: new Date().toISOString().split('T')[0], // fix
        source: 'dashboard', // fix
        receipt_url,
      });
  
      toast.success('Expense submitted successfully!', { id: loadingToast });
      navigate(`/spends/${spend.id}`);
    } catch (error: any) {
      console.error('API RAW ERROR:', error.response || error);
      toast.error('Submission failed. Please try again.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // const onSubmit = async (data: CreateSpendForm) => {
  //   if (!user) return;
    
  //   setIsSubmitting(true);
  //   const loadingToast = toast.loading('Processing your expense...');

  //   try {
  //     let receipt_url = undefined;

  //     // Upload to Cloudinary if file exists
  //     if (uploadedFile) {
  //       toast.loading('Uploading receipt to Cloudinary...', { id: loadingToast });
  //       receipt_url = await uploadToCloudinary(uploadedFile);
  //     }

  //     // Submit to Backend
  //     toast.loading('Saving expense details...', { id: loadingToast });
  //     const spend = await createSpend({
  //       amount: data.amount,
  //       currency: data.currency,
  //       category: data.category,
  //       description: data.description,
  //       receipt_url: receipt_url,
  //     });
      
  //     toast.success('Expense submitted successfully!', { id: loadingToast });
  //     navigate(`/spends/${spend.id}`);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Submission failed. Please try again.', { id: loadingToast });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <AppLayout title="Create Spend">
      <div className="max-w-2xl mx-auto pb-12">
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50">
            <CardTitle className="text-xl font-bold text-slate-900">New Expense</CardTitle>
            <CardDescription>
              Submit details and attach a receipt for reimbursement.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-semibold">
                    Amount <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium font-mono">
                      {CURRENCY_SYMBOLS[selectedCurrency as keyof typeof CURRENCY_SYMBOLS]}
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-9 font-mono focus-visible:ring-[#0047AB]"
                      {...register('amount', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-semibold">Currency</Label>
                  <Select
                    defaultValue="USD"
                    onValueChange={(value) => setValue('currency', value as Currency)}
                  >
                    <SelectTrigger className="focus:ring-[#0047AB]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                        <SelectItem key={code} value={code}>{code} ({symbol})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                <Select
                  defaultValue="other"
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What was this expense for?"
                  className="min-h-[100px] resize-none focus-visible:ring-[#0047AB]"
                  {...register('description')}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Receipt Attachment</Label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive 
                      ? 'border-[#0047AB] bg-blue-50/50 scale-[1.01]' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                  }`}
                >
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center">
                            {previewUrl ? <ImageIcon className="h-5 w-5 text-[#0047AB]" /> : <FileText className="h-5 w-5 text-[#0047AB]" />}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm text-slate-900 truncate max-w-[180px]">{uploadedFile.name}</p>
                            <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => { setUploadedFile(null); setPreviewUrl(null); }}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {previewUrl && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-white">
                          <img src={previewUrl} alt="Preview" className="object-contain w-full h-full" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-12 w-12 bg-white rounded-full border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
                        <Upload className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600">
                        <label className="text-[#0047AB] font-semibold cursor-pointer hover:underline">
                          Click to upload
                          <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                        </label>
                        {' '}or drag and drop
                      </p>
                      <p className="text-xs text-slate-400 font-medium">PNG, JPG or PDF (max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="text-slate-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0047AB] hover:bg-[#003d94] min-w-[140px] shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Expense'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}