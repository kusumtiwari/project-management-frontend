// components/ui/ModalForm.tsx
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ModalFormProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formTitle: string;
    submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode; // form fields
};

const ModalForm: React.FC<ModalFormProps> = ({
    open,
    onOpenChange,
    formTitle,
    submitHandler,
    children,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white rounded-xl p-6">
                <form onSubmit={submitHandler}>
                    <DialogHeader>
                        <DialogTitle>{formTitle}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">{children}</div>

                    <DialogFooter className="mt-6 flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ModalForm;
