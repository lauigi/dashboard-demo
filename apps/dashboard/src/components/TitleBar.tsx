import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';
import { ReactNode } from 'react';

interface ITitleBar {
  title: ReactNode;
  children?: ReactNode;
  titleAppend?: ReactNode;
}

export default function TitleBar({ title, children, titleAppend }: ITitleBar) {
  return (
    <div className="sticky z-50 top-12 bg-white dark:bg-gray-900">
      <div className="flex sm:justify-between items-center px-6 flex-wrap sm:flex-nowrap py-4 gap-y-3 dark:text-gray-200">
        <h2
          className={cn(
            'text-3xl font-semibold tracking-tight',
            !titleAppend && 'mr-auto',
          )}
        >
          {title}
        </h2>
        {titleAppend}
        {children}
      </div>
      <Separator className="mb-2 shadow" />
    </div>
  );
}
