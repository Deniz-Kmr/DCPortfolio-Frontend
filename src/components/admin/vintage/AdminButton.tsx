import type { ButtonHTMLAttributes, ReactNode } from 'react';

type AdminButtonVariant = 'primary' | 'neutral' | 'danger';

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: AdminButtonVariant;
};

const variantClasses: Record<AdminButtonVariant, string> = {
  primary:
    'border-[#17406F] bg-[#D7E9FF] text-[#082F5F] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#7AA7D9] hover:bg-[#C6DFFF]',
  neutral:
    'border-[#7C8794] bg-[#EEF1F5] text-[#1F2937] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#9AA4B2] hover:bg-white',
  danger:
    'border-[#8B1E1E] bg-[#F8D7D7] text-[#7F1D1D] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#C66] hover:bg-[#F5C8C8]',
};

export function AdminButton({
  children,
  variant = 'neutral',
  className = '',
  type = 'button',
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={[
        'rounded-sm border px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
