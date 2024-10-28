import { useFieldArrayFormContext } from '@/components/form/FieldArrayFormProvider';
import type { CreateBlogPostFormData } from '@/models/blogPost/create/formSchema';

export default function ContentInputList() {
  const { register, fields } =
    useFieldArrayFormContext<CreateBlogPostFormData>();

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id}>
          <label htmlFor={`contents.${index}.text`}>{field.type}</label>
          <input
            id={`contents.${index}.text`}
            {...register(`contents.${index}.text` as const)}
          />
        </div>
      ))}
    </>
  );
}
