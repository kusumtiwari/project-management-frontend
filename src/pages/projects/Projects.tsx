import React from "react";
import NoData from "../../components/elements/no-data/NoData";
import { useFetchProjectList, useCreateProject } from "./useProjectActions";
import useProjectStore from "./useProjectStore";
import Header from "../../components/elements/heading/Header";
import { Button } from "../../components/ui/button";
import ModalForm from "@/components/ui/ModalForm";
import { AddProjectFormFields } from "./AddProjectFormFields";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import ProjectList from "./ProjectList";

const Projects: React.FC = () => {
  useFetchProjectList();
  const projectList = useProjectStore((state) => state.projectList);
  const {mutate:createProject} = useCreateProject();
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      name: string;
      description?: string;
      deadline?: string;
    };

    const newProject = {
      ...data,
      status: "Not Started" as const,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };

   console.log("Project to create:", newProject);
   createProject(newProject,{
    onSuccess:(response:any) => {
      if(response?.success){
        toast.success(response?.message);
        closeModal();
      }
      else{
        toast.error(response?.message);
      }
    }
   });
  };

  return (
    <div>
      <Header
        text="Projects"
        rightContent={
          <Button onClick={openModal} variant="default" size="sm">
            Add Project
          </Button>
        }
      />

      {projectList?.length === 0 ? <NoData /> : <ProjectList projects={projectList} />}

      <ModalForm
        open={isOpen}
        onOpenChange={setIsOpen}
        formTitle="Add New Project"
        submitHandler={submitHandler}
      >
        <AddProjectFormFields />
      </ModalForm>
    </div>
  );
};

export default Projects;
