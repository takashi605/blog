import { useFieldArrayFormContext } from "@/models/blogPost/create/FieldArrayFormProvider";

function AddContentButton() {
  const { append } = useFieldArrayFormContext();

  return (
    <button type="button" onClick={() => append({ type: 'h2', text: '' })}>
      h2
    </button>
  );
}

export default AddContentButton;
