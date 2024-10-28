'use client';
import { useFieldArrayFormContext } from '@/components/form/FieldArrayFormProvider';
import type { CreateBlogPostFormData } from '@/models/blogPost/create/formSchema';

export default function ContentInputList() {
  const { fields } = useFieldArrayFormContext<CreateBlogPostFormData>();

  return (
    <>
      {fields.map((field, index) => (
        <ContentInput
          key={field.id}
          inputId={`contents.${index}.text`}
          contentType={field.type}
        />
      ))}
    </>
  );
}

type ContentInputProps = {
  inputId: `contents.${number}.text`;
  contentType: string;
};
function ContentInput({ inputId, contentType }: ContentInputProps) {
  const { register } = useFieldArrayFormContext<CreateBlogPostFormData>();
  return (
    <div>
      <label htmlFor={inputId}>{contentType}</label>
      <input id={inputId} {...register(inputId)} />
    </div>
  );
}
