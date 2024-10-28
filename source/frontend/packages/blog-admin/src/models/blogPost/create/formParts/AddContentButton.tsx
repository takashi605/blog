import { useFieldArrayFormContext } from '@/components/form/FieldArrayFormProvider';

export function AddH2Button() {
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'h2', text: '' })}>
      h2
    </button>
  );
}

export function AddH3Button() {
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'h3', text: '' })}>
      h3
    </button>
  );
}

export function AddParagraphButton() {
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'paragraph', text: '' })}>
      paragraph
    </button>
  );
}
