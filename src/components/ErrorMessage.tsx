import * as React from "react";

import Text from "./Text";
import Layout from "./Layout";

export interface ErrorMessageProps {
  title?: string;
  message?: string;
}

function ErrorMessage({
  title = "Oops!",
  message = "Something went wrong. Please try again later.",
}: ErrorMessageProps) {
  return (
    <Layout.Column greedy justifyContent="center" alignItems="center">
      <Text.Title>{title}</Text.Title>
      <Text.Paragraph>{message}</Text.Paragraph>
    </Layout.Column>
  );
}

export default ErrorMessage;
