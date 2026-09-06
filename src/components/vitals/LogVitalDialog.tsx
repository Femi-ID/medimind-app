'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCreateVital } from '@/hooks/use-vitals';
import { logVitalSchema, type LogVitalValues } from '@/lib/validators/vitals';
import { getErrorMessage } from '@/lib/utils';

interface LogVitalDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LogVitalDialog({ open, onClose }: LogVitalDialogProps) {
  const createVital = useCreateVital();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogVitalValues>({
    resolver: zodResolver(logVitalSchema),
    defaultValues: {},
  });

  function handleClose() {
    reset({});
    onClose();
  }

  async function onSubmit(values: LogVitalValues) {
    try {
      await createVital.mutateAsync({
        systolicBp: values.systolicBp ? Number(values.systolicBp) : undefined,
        diastolicBp: values.diastolicBp ? Number(values.diastolicBp) : undefined,
        heartRate: values.heartRate ? Number(values.heartRate) : undefined,
        bloodGlucose: values.bloodGlucose ? Number(values.bloodGlucose) : undefined,
        weight: values.weight ? Number(values.weight) : undefined,
      });
      toast.success('Reading logged');
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save that reading.'));
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Log a vital"
      description="Enter any readings you have — you don't need all of them."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {errors.systolicBp && !errors.diastolicBp && (
          <p className="text-xs text-red-600">{errors.systolicBp.message}</p>
        )}

        <div>
          <Label className="mb-2">Blood pressure (mmHg)</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                type="number"
                step={1}
                placeholder="Systolic — 120"
                invalid={!!errors.systolicBp}
                {...register('systolicBp')}
              />
            </div>
            <div>
              <Input
                type="number"
                step={1}
                placeholder="Diastolic — 80"
                invalid={!!errors.diastolicBp}
                {...register('diastolicBp')}
              />
            </div>
          </div>
          {errors.diastolicBp && <p className="mt-1.5 text-xs text-red-600">{errors.diastolicBp.message}</p>}
        </div>

        <div>
          <Label htmlFor="heartRate" className="mb-2">Heart rate (bpm)</Label>
          <Input id="heartRate" type="number" step={1} placeholder="72" invalid={!!errors.heartRate} {...register('heartRate')} />
          {errors.heartRate && <p className="mt-1.5 text-xs text-red-600">{errors.heartRate.message}</p>}
        </div>

        <div>
          <Label htmlFor="bloodGlucose" className="mb-2">Blood glucose (mmol/L)</Label>
          <Input id="bloodGlucose" type="number" step={0.1} placeholder="5.4" invalid={!!errors.bloodGlucose} {...register('bloodGlucose')} />
          {errors.bloodGlucose && <p className="mt-1.5 text-xs text-red-600">{errors.bloodGlucose.message}</p>}
        </div>

        <div>
          <Label htmlFor="weight" className="mb-2">Weight (kg)</Label>
          <Input id="weight" type="number" step={0.1} placeholder="74.2" invalid={!!errors.weight} {...register('weight')} />
          {errors.weight && <p className="mt-1.5 text-xs text-red-600">{errors.weight.message}</p>}
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={createVital.isPending}>
            Save reading
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
