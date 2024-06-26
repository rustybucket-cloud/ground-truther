import { HTMLAttributes } from "react";

type ButtonEmphasis = 'high' | 'medium' | 'low';

export type ButtonProps = {
    children?: React.ReactNode;
    emphasis?: ButtonEmphasis;
} & HTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, emphasis = 'medium', ...rest }: ButtonProps) {
    return <button className={`${getClasses(emphasis)}${className ? ` ${className}` : ''}`} {...rest}>{children}</button>
}

function getClasses(emphasis: ButtonEmphasis): string {
    const baseClasses = 'p-3 rounded disabled:bg-gray-200';
    switch (emphasis) {
        case 'high':
            return `${baseClasses} bg-primary text-white`;
        case 'medium':
            return `${baseClasses} border-primary border-2 hover:bg-primary hover:text-white text-primary`;
        case 'low':
            return `${baseClasses} bg-gray-200 text-black`;
        default:
            return baseClasses;
    }
}