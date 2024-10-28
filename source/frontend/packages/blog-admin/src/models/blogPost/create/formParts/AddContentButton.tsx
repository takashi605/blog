import { useFieldArrayFormContext } from '@/components/form/FieldArrayFormProvider';

export default function AddContentButtonList() {
  return (
    <>
      <AddH2Button />
      <AddH3Button />
      <AddParagraphButton />
    </>
  );
}

function AddH2Button() {
  return <AddContentButton type="h2" />;
}

function AddH3Button() {
  return <AddContentButton type="h3" />;
}

function AddParagraphButton() {
  return <AddContentButton type="paragraph" />;
}

function AddContentButton(props: { type: 'h2' | 'h3' | 'paragraph' }) {
  const { append } = useFieldArrayFormContext();

  return (
    <button
      type="button"
      onClick={() => append({ type: props.type, text: '' })}
    >
      {props.type}
    </button>
  );
}
