import React, { type JSX } from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Icon(
  SvgComponent: (props: React.SVGProps<SVGSVGElement>) => JSX.Element,
) {
  return function IconWithBase({ size = 24, ...rest }: IconProps) {
    return <SvgComponent width={size} height={size} {...rest} />;
  };
}
