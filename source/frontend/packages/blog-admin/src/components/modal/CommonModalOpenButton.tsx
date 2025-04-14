import { useCommonModalContext } from './CommonModalProvider';

type CommonModalOpenButtonProps = {
  children: React.ReactNode;
  isModalOpenable?: boolean;
};

function CommonModalOpenButton({
  isModalOpenable = true,
  children,
}: CommonModalOpenButtonProps) {
  const { openModal } = useCommonModalContext();
  const openModalHandler = () => {
    if (isModalOpenable) {
      openModal();
    }
  };

  return (
    <>
      <button type="button" onClick={openModalHandler}>
        {children}
      </button>
    </>
  );
}

export default CommonModalOpenButton;
