const sharedClasses = "h-[25px]";

export type IconProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function Icon({ className, children }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={`${sharedClasses}${className ? ` ${className}` : ""}`}
    >
      {children}
    </svg>
  );
}
