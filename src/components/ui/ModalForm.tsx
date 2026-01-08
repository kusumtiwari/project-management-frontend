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
            <DialogContent className="sm:max-w-md bg-white rounded-xl p-6 max-h-[85vh] flex flex-col overflow-hidden">
                <form onSubmit={submitHandler} className="flex flex-col overflow-hidden h-full">
                    <DialogHeader>
                        <DialogTitle>{formTitle}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 overflow-y-auto flex-1 pr-4">{children}</div>

                    <DialogFooter className="mt-6 flex gap-2 justify-end flex-shrink-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant='secondary'>Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ModalForm;
