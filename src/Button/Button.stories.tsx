import { Button, ButtonProps } from "./Button";
import { IconButton as IconButtonComponent } from "./IconButton";
import { Plus } from "../components/Icons";

export default {
  title: "components/Button",
  component: Button,
  argTypes: {
    children: {
        control: {
            type: "text",
            defaultValue: "Button",
        },
    },
    emphasis: {
      control: {
        type: "select",
        options: ["high", "medium", "low"],
      },
    },
  },
};

export const Primary = ({ children = 'Example', ...args }: ButtonProps) => <Button {...args}>{children}</Button>;

export const IconButton = (args: ButtonProps) => <IconButtonComponent Icon={Plus} {...args} />;