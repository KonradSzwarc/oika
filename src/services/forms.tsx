import { Slot } from '@radix-ui/react-slot';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { type ComponentPropsWithRef, createContext, use, useId, useMemo } from 'react';
import { Input, type InputProps } from '@/common/components/input';
import { Label, type LabelProps } from '@/common/components/label';
import { cn } from './styles/utils';

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

export interface FormProps extends Omit<ComponentPropsWithRef<'form'>, 'onSubmit'> {}

export function Form(props: FormProps) {
  const form = useFormContext();

  return (
    <form
      onSubmit={async (e) => {
        e.stopPropagation();
        e.preventDefault();
        await form.handleSubmit();
      }}
      {...props}
    />
  );
}

function useFormField() {
  const field = useFieldContext();

  const itemContext = use(FormItemContext);
  if (!itemContext) {
    throw new Error('Form Item components should be used within <FormItem>');
  }
  const { id } = itemContext;

  const isTouched = field.state.meta.isTouched;
  const isValid = field.state.meta.isValid;
  const error = field.state.meta.errors.map((err) => err.message).join(',');

  return useMemo(() => {
    const hasError = isTouched && !isValid;

    return {
      id,
      formItemId: `${id}-form-item`,
      formDescriptionId: `${id}-form-item-description`,
      formMessageId: `${id}-form-item-message`,
      error,
      hasError,
    };
  }, [id, isTouched, isValid, error]);
}

interface FormItemContextValue {
  id: string;
}

const FormItemContext = createContext<FormItemContextValue | null>(null);

export function FormItem({ className, ...props }: ComponentPropsWithRef<'div'>) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  );
}

export function FormLabel({ className, ...props }: LabelProps) {
  const { hasError, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={hasError}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

export function FormControl({ ...props }: ComponentPropsWithRef<typeof Slot>) {
  const { hasError, formItemId, formDescriptionId, formMessageId } = useFormField();

  const describedBy = hasError ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`;

  return (
    <Slot data-slot="form-control" id={formItemId} aria-describedby={describedBy} aria-invalid={hasError} {...props} />
  );
}

export function FormDescription({ className, ...props }: ComponentPropsWithRef<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const body = error ?? props.children;

  if (!body) {
    return null;
  }

  return (
    <p data-slot="form-message" id={formMessageId} className={cn('text-destructive text-sm', className)} {...props}>
      {body}
    </p>
  );
}

export function InputField(props: InputProps) {
  const field = useFieldContext<string>();

  return (
    <Input
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      {...props}
    />
  );
}
