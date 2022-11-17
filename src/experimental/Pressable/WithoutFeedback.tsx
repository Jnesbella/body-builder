import * as React from "react";
import styled from "styled-components";

import { Full, full, Greedy, greedy } from "../../components";

export interface WithoutFeedbackProps extends Full, Greedy {}

const WithoutFeedback = styled.div<WithoutFeedbackProps>`
  ${greedy};
  ${full};

  user-select: none;
  display: inline-flex;
`;

export default WithoutFeedback;
