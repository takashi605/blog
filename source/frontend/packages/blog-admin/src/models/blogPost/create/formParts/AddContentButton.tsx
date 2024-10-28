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
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'h2', text: '' })}>
      h2
    </button>
  );
}

function AddH3Button() {
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'h3', text: '' })}>
      h3
    </button>
  );
}

function AddParagraphButton() {
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'paragraph', text: '' })}>
      paragraph
    </button>
  );
}
