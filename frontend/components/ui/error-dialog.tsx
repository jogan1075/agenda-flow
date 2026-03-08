'use client';

import { Button } from './button';
import { Card } from './card';

type ErrorDialogProps = {
  message: string;
  onClose: () => void;
  title?: string;
};

export function ErrorDialog({ message, onClose, title = 'Error' }: ErrorDialogProps) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md space-y-3 border border-red-200 bg-red-50">
        <h3 className="text-base font-semibold text-red-800">{title}</h3>
        <p className="text-sm text-red-700">{message}</p>
        <Button onClick={onClose}>Cerrar</Button>
      </Card>
    </div>
  );
}
