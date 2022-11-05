import * as React from "react";
import { Modal as DefaultModal } from "react-native";
import * as Icons from "react-bootstrap-icons";

import styled from "styled-components/native";
import { background } from "../styled-components";
import { theme } from "../../styles";

const DialogContainer = styled(DefaultModal)`
   {
    pointer-events: none;
  }

  * {
    pointer-events: all;
  }
`;

export interface ModalProps {
  isVisible?: boolean;
  onDismiss?: () => void;
  isDismissable?: boolean;
  children?: React.ReactNode;
}

function Modal({ isVisible, children, onDismiss }: ModalProps) {
  return (
    <DialogContainer
      visible={isVisible}
      transparent
      onDismiss={onDismiss}
      presentationStyle="overFullScreen"
    >
      {children}
    </DialogContainer>
  );
}

export default Modal;
