import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import PlusIcon from "~icons/mdi/plus";

import { Form } from "@/components/Form";
import { Icon } from "@/components/Icon";
import { Popover } from "@/components/Popover";

export interface AddTagButtonProps {
    tags: string[];
    onSubmit: (tag: string) => void;
}

const formSchema = z.object({
    tag: z.string().min(1).max(65536),
});
type FormValues = z.infer<typeof formSchema>;

export function AddTagButton({ tags, onSubmit }: AddTagButtonProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    return (
        <Popover>
            <Popover.Trigger asChild>
                <button className="flex items-center gap-1 rounded-full bg-gray-300 px-2 py-0.5 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    <Icon icon={PlusIcon} label="add tag" className="h-4 w-4" />
                    {tags.length === 0 && <span>Add tag</span>}
                </button>
            </Popover.Trigger>
            <Popover.Content>
                {({ close }) => (
                    <Form
                        form={form}
                        submitHandler={(data) => {
                            onSubmit(data.tag);
                            close();
                        }}
                        className="flex items-center gap-1"
                    >
                        <Form.Input name="tag" placeholder="Tag name" />
                        <Form.Button size="md" color="primary">
                            Add
                        </Form.Button>
                    </Form>
                )}
            </Popover.Content>
        </Popover>
    );
}
