import { type ElementType, type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: "default" | "wide";
};

const maxWidthBySize: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export function Container({ children, className = "", as: Tag = "div", size = "default" }: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full ${maxWidthBySize[size]} container-px ${className}`}>
      {children}
    </Tag>
  );
}
