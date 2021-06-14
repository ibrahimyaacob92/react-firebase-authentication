import React from "react";

interface IErrorTextProps {
  error: string;
}

const ErrorText: React.FC<IErrorTextProps> = ({ error }: IErrorTextProps) => {
  if (error === "") return null;
  return <small className="text-danger">{error}</small>;
};

export default ErrorText;
