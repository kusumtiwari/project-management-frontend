// components/ui/useModalForm.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

type UseModalFormProps = {
    formTitle: string;
    submitHandler: (data: any) => void;
    FormFields: React.ReactNode;
};

export const useModalForm = ({ formTitle, submitHandler, FormFields }: UseModalFormProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const handleSubmit = (e: React.FormEvent) => {
        console.log(formData,'form dataa');
        e.preventDefault();
        submitHandler(formData);
        closeModal();
    };

    const ModalForm = () => (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md bg-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{formTitle}</DialogTitle>
                    </DialogHeader>

                    <div>{FormFields}</div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant='primary'>Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );

    return { openModal, ModalForm };
};
