import * as React from "react"
import { cn } from "~/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, defaultValue, onChange, ...props }, ref) => {
    // Usa um estado interno para inicializar o valor com `defaultValue` se `value` não for fornecido
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")

    React.useEffect(() => {
      // Atualiza o estado interno se `value` mudar
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    return (
      <input
        type={type}
        value={value !== undefined ? value : internalValue} // Sempre controlado
        onChange={(e) => {
          setInternalValue(e.target.value) // Atualiza o estado interno
          onChange?.(e) // Chama o onChange passado como prop
        }}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }