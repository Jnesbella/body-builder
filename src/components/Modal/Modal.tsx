import * as React from "react";
import styled from "styled-components/native";
import { Modal as DefaultModal, ScrollView } from "react-native";
import * as Icons from "react-bootstrap-icons";

import { theme } from "../../styles";

import { background, rounded, Space, Rounded } from "../styled-components";
import Button, { ButtonProps } from "../Button";
import Layout from "../Layout";
import IconButton from "../IconButton";
import Text from "../Text";
import Divider from "../Divider";
import { bordered, Bordered } from "../bordered";

const ModalBackdrop = styled.Pressable.attrs({
  background: theme.colors.backdrop,
})`
  ${background};

  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const ModalContainer = styled.Pressable.attrs({
  background: theme.colors.background,
})<Rounded & Bordered>`
  ${background};
  ${rounded};
  ${bordered};

  min-width: 400px;
  max-width: 600px;
  max-height: 100%;
`;

const ModalContentWrapper = styled(Layout.Box).attrs({ size: 1 })``;

const ModalHeaderWrapper = styled(Layout.Row).attrs({
  alignItems: "center",
  justifyContent: "space-between",
})``;

export interface ModalDismissButtonProps extends ButtonProps {}

function ModalDismissButton({ ...buttonProps }: ModalDismissButtonProps) {
  return (
    <Button title="dismiss" color="accent" mode="contained" {...buttonProps} />
  );
}

function ModalDismissIconButton({ ...buttonProps }: ModalDismissButtonProps) {
  return <IconButton icon={Icons.X} color="accent" {...buttonProps} />;
}

export interface ModalProps {
  isVisible?: boolean;
  onDismiss?: () => void;
  title?: string;
  content?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  isDismissable?: boolean;
  layoutActions?: (props: React.PropsWithChildren<{}>) => JSX.Element;
}

function Modal({
  isVisible,
  onDismiss,
  title,
  content,
  primaryAction,
  secondaryAction,
  isDismissable = true,
  layoutActions: LayoutActions = Layout.Column,
}: ModalProps) {
  return (
    <DefaultModal visible={isVisible} transparent onDismiss={onDismiss}>
      <ModalBackdrop onPress={onDismiss} disabled={!isDismissable}>
        <ScrollView>
          <Space />

          <ModalContainer>
            <ModalContentWrapper>
              {title && (
                <React.Fragment>
                  <ModalHeaderWrapper>
                    <Text.Title numberOfLines={1}>{title}</Text.Title>

                    {onDismiss && (
                      <ModalDismissIconButton
                        onPress={onDismiss}
                        disabled={!isDismissable}
                      />
                    )}
                  </ModalHeaderWrapper>
                  <Divider />
                </React.Fragment>
              )}

              {!!content && !!title && <Space />}

              {content}

              {(!!primaryAction || !!secondaryAction) && (
                <React.Fragment>
                  <Space size={2} />

                  <LayoutActions>
                    {primaryAction}

                    {!!primaryAction && !!secondaryAction && <Space />}

                    {secondaryAction}
                  </LayoutActions>
                </React.Fragment>
              )}
            </ModalContentWrapper>
          </ModalContainer>

          <Space />
        </ScrollView>
      </ModalBackdrop>
    </DefaultModal>
  );
}

Modal.Content = styled.View``;
Modal.DismissButton = ModalDismissButton;
Modal.DismissIconButton = ModalDismissIconButton;

export default Modal;
