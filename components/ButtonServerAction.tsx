import { Button, ButtonProps } from "./ui/button";

type Props = ButtonProps & {
  onClick?: () => Promise<void> | void;
};

export const ButtonServerAction: React.FC<Props> = ({
  className,
  variant,
  onClick,
  ...props
}) => {
  return (
    <Button
      className={className}
      variant={variant}
      onClick={async () => {
        if (onClick) await onClick();
      }}
    >
      {props.children}
    </Button>
  );
};
