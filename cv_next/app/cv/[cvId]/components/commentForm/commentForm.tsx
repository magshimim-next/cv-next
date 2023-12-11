"use client";

import { useRef } from "react";

type CommentFormProps = {
    children?: React.ReactNode,
    formAction: (formData: FormData) => Promise<string | null>,
    revalidatePath: (path: string) => Promise<void>,
    show: boolean
}

//TODO: think about how to connect a pending/loading state here to the loading of new data in comments.
//Alternatively, we can show a loading state in the comments.. need to figure out how.
export const CommentForm:React.FC<CommentFormProps> = ({ children, formAction, revalidatePath, show }) => {

    const formRef = useRef<HTMLFormElement | null>(null);

    const interactiveFormAction = (formData: FormData) => {

        return formAction(formData)
        .finally(() => {
            formRef.current?.reset();
            revalidatePath("/cv/[cvId]");
        });
    }

    return (
        <form className="mb-6" hidden={!show} ref={formRef} action={interactiveFormAction}>
            { children }
        </form>
    )
}