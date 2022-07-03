import * as React from "react";
import styled from "styled-components/native";
import { Modal as DefaultModal, ScrollView, Animated } from "react-native";
import * as Icons from "react-bootstrap-icons";

import { theme } from "../../styles";

import useAnimation from "../../hooks/useAnimation";
import { useAnimatedValue } from "../../animated-value";

import {
  AlignItems,
  background,
  greedy,
  JustifyContent,
  Space,
  Greedy,
  full,
  Full,
} from "../styled-components";
import Button, { ButtonProps } from "../Button";
import Layout from "../Layout";
import IconButton from "../IconButton";
import Text from "../Text";
import Surface from "../Surface";

const ModalFade = styled(Animated.View)<Greedy>`
  ${greedy}
`;

const ModalSlide = styled(Animated.View).attrs({
  fullHeight: true,
})<Full>`
  ${full};
`;

const ModalBackdrop = styled.Pressable.attrs({
  background: theme.colors.backdrop,
})`
  ${background};

  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
`;

const ModalHeaderWrapper = styled(Layout.Row).attrs({
  alignItems: AlignItems.Center,
  justifyContent: JustifyContent.SpaceBetween,
  spacingSize: [1, 0],
})``;

export interface ModalDismissButtonProps extends ButtonProps {}

function ModalDismissButton({ ...buttonProps }: ModalDismissButtonProps) {
  return (
    <Button title="dismiss" color="accent" mode="contained" {...buttonProps} />
  );
}

function ModalDismissIconButton({ ...buttonProps }: ModalDismissButtonProps) {
  return <IconButton icon={Icons.X} color="primary" {...buttonProps} />;
}

const MODAL_DRAWER_WIDTH = theme.spacing * 50;

export interface ModalDrawerElement {
  dismiss: () => void;
}

export interface ModalDrawerProps {
  isVisible?: boolean;
  onDismiss?: () => void;
  title?: string;
  content?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  isDismissable?: boolean;
  layoutActions?: (props: React.PropsWithChildren<{}>) => JSX.Element;
}

const ModalDrawer = React.forwardRef<ModalDrawerElement, ModalDrawerProps>(
  (
    {
      isVisible: isVisibleProp,
      onDismiss,
      title,
      content,
      primaryAction,
      secondaryAction,
      isDismissable = true,
      layoutActions: LayoutActions = Layout.Column,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(isVisibleProp);

    const opacity = useAnimatedValue({ name: "modalDrawer-opacity" });
    const width = useAnimatedValue({ name: "modalDrawer-width" });

    const { start: fade } = useAnimation({
      toValue: isVisible ? 1 : 0,
      defaultValue: opacity,
    });

    const { start: slide } = useAnimation({
      toValue: isVisible ? MODAL_DRAWER_WIDTH : 0,
      defaultValue: width,
    });

    // React.useEffect(() => {
    //   Promise.all([
    //     new Promise<void>((resolve) => slide(resolve)),
    //     new Promise<void>((resolve) => fade(resolve))
    //   ]).then(() => {
    //     if (!isVisible) {
    //       onDismiss?.()
    //     }
    //   })
    // }, [isVisible])

    React.useEffect(() => {
      slide();
    }, [slide, isVisible]);

    React.useEffect(() => {
      fade(() => {
        if (!isVisible) {
          onDismiss?.();
        }
      });
    }, [fade, isVisible]);

    React.useEffect(() => {
      setIsVisible(isVisibleProp);
    }, [isVisibleProp]);

    const dismiss = () => setIsVisible(false);

    const element: ModalDrawerElement = {
      dismiss,
    };

    React.useEffect(() => {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref && "current" in ref) {
        ref.current = element;
      }
    });

    return (
      <DefaultModal
        visible={isVisible || isVisibleProp}
        transparent
        // onDismiss={() => setIsVisible(false)}
      >
        <ModalFade style={{ opacity }}>
          <ModalBackdrop onPress={dismiss} disabled={!isDismissable}>
            <ModalSlide style={{ width }}>
              <Surface
                style={{
                  minHeight: "100%",
                  width: theme.spacing * 50,
                }}
              >
                <Surface
                  background={theme.colors.primaryLight}
                  greedy
                  style={{
                    borderRightWidth: theme.borderThickness,
                    borderRightColor: theme.colors.primary,
                  }}
                >
                  <Layout.Box greedy>
                    {title && (
                      <Surface>
                        <ModalHeaderWrapper>
                          <Text.Title numberOfLines={1}>{title}</Text.Title>

                          {onDismiss && (
                            <ModalDismissIconButton
                              onPress={dismiss}
                              disabled={!isDismissable}
                            />
                          )}
                        </ModalHeaderWrapper>
                      </Surface>
                    )}

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
                  </Layout.Box>
                </Surface>
              </Surface>
            </ModalSlide>
          </ModalBackdrop>
        </ModalFade>
      </DefaultModal>
    );
  }
);

// type ModalDrawer = typeof ModalDrawer & {
//   Content
// }

// ModalDrawer.Content = styled.View``
// ModalDrawer.DismissButton = ModalDismissButton
// ModalDrawer.DismissIconButton = ModalDismissIconButton

export default ModalDrawer;
