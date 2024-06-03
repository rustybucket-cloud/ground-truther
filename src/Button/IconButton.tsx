import { Button, ButtonProps } from "./Button";

export type IconButtonProps = {
    Icon: React.ComponentType<{ className?: string }>;
} & ButtonProps;

export function IconButton({ Icon, ...props }: IconButtonProps) {
    return <Button {...props}><Icon className="fill-black" /></Button>
}