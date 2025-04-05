import { useCommonModalContext } from './CommonModalProvider';

type CommonModalCloseButtonProps = {
  children: React.ReactNode;
};

function CommonModalCloseButton({ children }: CommonModalCloseButtonProps) {
  const { closeModal } = useCommonModalContext();

  return (
    <>
      <button onClick={closeModal} className="modal-close" type="button">
        {children}
      </button>
    </>
  );
}

export default CommonModalCloseButton;
