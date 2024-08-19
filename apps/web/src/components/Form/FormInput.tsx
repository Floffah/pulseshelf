"use client";

import { ComponentProps, useContext } from "react";

import {
    FormField,
    FormFieldBaseProps,
    useFormField,
} from "@/components/Form/FormField";
import { FormContext } from "@/components/Form/index";
import { Input } from "@/components/Input";

export interface FormInputProps
    extends Omit<
        ComponentProps<typeof Input> & FormFieldBaseProps,
        "children"
    > {}

export function FormInput({ ...props }: FormInputProps) {
    "use client";

    const { form } = useContext(FormContext);

    const {
        fieldProps,
        controlProps: { name, ...controlProps },
    } = useFormField(props);

    return (
        <FormField {...fieldProps}>
            <Input {...controlProps} {...form.register(name)} name={name} />
        </FormField>
    );
}
