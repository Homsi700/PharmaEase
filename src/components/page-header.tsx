
import type React from 'react';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface PageHeaderProps {
  titleKey: string; // Changed to titleKey
  descriptionKey?: string; // Changed to descriptionKey
  descriptionValues?: Record<string, string>; // For dynamic values in description
  children?: React.ReactNode; // For action buttons like "Add New"
}

export function PageHeader({ titleKey, descriptionKey, descriptionValues, children }: PageHeaderProps) {
  const { t } = useAppTranslation();
  return (
    <div className="mb-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t(titleKey)}</h1>
          {descriptionKey && (
            <p className="mt-1 text-muted-foreground">{t(descriptionKey, descriptionValues)}</p>
          )}
        </div>
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </div>
  );
}
