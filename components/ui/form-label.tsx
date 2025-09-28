import React from "react";

interface FormItemInfoProps {
  message: string;
}

const FormItemInfo = ({ message }: FormItemInfoProps) => {
  return (
    <p className="text-xs text-muted-foreground/80 bg-muted/30 rounded-md px-3 py-2">
      {message}
    </p>
  );
};

export default FormItemInfo;
