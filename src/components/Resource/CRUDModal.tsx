import * as React from "react";
import { ScrollView } from "react-native";
import { useForm, UseFormReturn } from "react-hook-form";

import { ResourceDocument } from "../../services";
import { useCRUD, UseCRUD } from "../../hooks";

import Modal from "../Modal/Modal";
import Button from "../Button";

export interface CRUDModalProps<T extends ResourceDocument> extends UseCRUD<T> {
  disabled?: boolean;
  children?: (props?: {
    onPress: () => void;
    disabled?: boolean;
    title?: string;
  }) => JSX.Element;
  renderForm?: (
    props: UseFormReturn<T> & {
      isNew?: boolean;
      isDisabled?: boolean;
      defaultValues: any;
    }
  ) => JSX.Element;
  getDefaultValues?: (data?: T) => any;
  getModalTitle?: (data?: T, options?: { isNew?: boolean }) => string;
  getButtonTitle?: (data?: T, options?: { isNew?: boolean }) => string;
  onSuccess?: (resource: T) => void;
}

function CRUDModal<T extends ResourceDocument>({
  service,
  id: resourceId,
  disabled,
  // children,
  getDefaultValues,
  getButtonTitle,
  getModalTitle,
  // renderForm,
  onSuccess,
}: CRUDModalProps<T>) {
  const [_isVisible, setIsVisible] = React.useState(false);

  const { data, create, update, isUpdating, isCreating } = useCRUD<T>({
    service,
    id: resourceId,
  });

  const defaultValues = getDefaultValues?.(data);

  const form = useForm({
    defaultValues,
  });
  const { reset, handleSubmit: _handleSubmit } = form;

  const isNew = !resourceId;
  const isLoading = isUpdating || isCreating;
  const isReady = resourceId ? !!data : true;
  const isDisabled = disabled || isLoading || !isReady;

  const title = isNew ? "New" : "Update";
  const buttonTitle = getButtonTitle?.(data, { isNew }) || title;
  const modalTitle = getModalTitle?.(data, { isNew }) || title;

  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    reset();
  };

  React.useEffect(() => {
    if (isReady) {
      reset(defaultValues);
    }
  }, [isReady, reset]);

  const _doSubmit = async (payload: any) => {
    const createOrUpdate = async () => {
      let resource: T;
      if (resourceId) {
        resource = await update({ ...payload, id: resourceId });
      } else {
        resource = await create(payload);
      }

      onSuccess?.(resource);

      if (isNew) {
        closeModal();
      }
    };

    try {
      await createOrUpdate();
    } catch (err) {
      console.log("err = ", err);
    }
  };

  const _openModalButton = (
    <Button
      title={buttonTitle}
      onPress={openModal}
      mode="contained"
      disabled={isDisabled}
    />
  );

  return (
    <React.Fragment>
      {/* {children?.({
        onPress: openModal,
        disabled: isDisabled,
        title: buttonTitle,
      }) || openModalButton}

      <Modal
        onDismiss={closeModal}
        isDismissable={!isLoading}
        title={modalTitle}
        isVisible={isVisible}
        primaryAction={
          <Button
            title={isNew ? buttonTitle : "Save"}
            onPress={() => {
              const handler = handleSubmit(doSubmit);
              handler();
            }}
            mode="contained"
            disabled={isDisabled}
          />
        }
        // secondaryAction={
        //   <Modal.DismissButton onPress={closeModal} disabled={isDisabled} />
        // }
        content={
          <ScrollView>
            <Modal.Content>
              {renderForm?.({ ...form, isNew, isDisabled, defaultValues })}
            </Modal.Content>
          </ScrollView>
        }
      /> */}
    </React.Fragment>
  );
}

export default CRUDModal;
