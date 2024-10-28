import { useFieldArrayFormContext } from '@/components/form/FieldArrayFormProvider';

function AddContentButton() {
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'h2', text: '' })}>
      h2
    </button>
  );
}

export default AddContentButton;
