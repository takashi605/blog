import { useCommonModalContext } from './CommonModalProvider';

type CommonModalOpenButtonProps = {
  children: React.ReactNode;
};

function CommonModalOpenButton({ children }: CommonModalOpenButtonProps) {
  const { openModal } = useCommonModalContext();

  return (
    <>
      <button type="button" onClick={openModal}>
        {children}
      </button>
    </>
  );
}

export default CommonModalOpenButton;
