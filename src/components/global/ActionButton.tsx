"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2, LucideIcon } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";
import { useState } from "react";

interface ActionButtonProps extends Omit<ButtonProps, 'children'> {
  icon?: LucideIcon;
  loadingText?: string;
  label: string;
  iconClassName?: string;
  showIconOnSubmit?: boolean;
  onClick?: () => Promise<void> | void;
}

export function ActionButton({
  // Button props
  variant = "outline",
  className = "w-full",
  // Content props
  icon: Icon,
  loadingText = "Please wait...",
  label,
  // Icon props
  iconClassName = "mr-2 size-4",
  showIconOnSubmit = true,
  // Click handler
  onClick,
  // Additional props
  ...buttonProps
}: ActionButtonProps) {
  const { pending: formPending } = useFormStatus();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    if (onClick) {
      setIsLoading(true);
      try {
        await onClick();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isPending = formPending || isLoading;

  return (
    <Button 
      disabled={isPending}
      variant={variant} 
      className={className}
      onClick={handleClick}
      {...buttonProps}
    >
      {isPending ? (
        <>
          <Loader2 className={`${iconClassName} animate-spin`} />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && showIconOnSubmit && (
            <Icon className={iconClassName} />
          )}
          {label}
        </>
      )}
    </Button>
  );
}