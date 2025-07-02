import React from 'react';
import SuccessMessage from '../../../components/form/parts/SuccessMessage';
import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import PostCheckboxes from './checkboxes/PostCheckboxes';
import type { PostsCheckboxesFormValues } from './checkboxes/PostCheckboxesProvider';
import PostCheckboxesFormProvider from './checkboxes/PostCheckboxesProvider';
import styles from './PostSelectModal.module.scss';

type PostSelectModalProps = {
  title: string;
  defaultValues: { checkedPosts: string[] };
  onSubmit: (data: PostsCheckboxesFormValues) => Promise<void>;
  validate: (value: string[]) => boolean | string;
  successMessage?: string;
  isSuccess?: boolean;
};

function PostSelectModal({
  title,
  defaultValues,
  onSubmit,
  validate,
  successMessage,
  isSuccess = false,
}: PostSelectModalProps) {
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
    }
  }, [isSuccess]);

  // isSuccessがfalseになったときにshowSuccessもリセット
  React.useEffect(() => {
    if (!isSuccess) {
      setShowSuccess(false);
    }
  }, [isSuccess]);

  const handleHideSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <CommonModal width="700px">
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{title}</h2>

        <PostCheckboxesFormProvider defaultValues={defaultValues}>
          <PostCheckboxes onSubmit={onSubmit} validate={validate} />
        </PostCheckboxesFormProvider>

        {successMessage && (
          <SuccessMessage
            message={successMessage}
            isVisible={showSuccess}
            onHide={handleHideSuccess}
          />
        )}

        <div className={styles.footer}>
          <CommonModalCloseButton>閉じる</CommonModalCloseButton>
        </div>
      </div>
    </CommonModal>
  );
}

export default React.memo(PostSelectModal);
