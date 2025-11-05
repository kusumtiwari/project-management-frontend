import Header from '@/components/elements/heading/Header';
import { Button } from '@/components/ui/button';
import ModalForm from '@/components/ui/ModalForm';
import { useModal } from '@/hooks/useModal';
import React from 'react';
import { useCreateTeamMember } from './useTeamMembersActions';
import NoData from '@/components/elements/no-data/NoData';
import { CreateTeamMemberFormFields } from './InviteTeamMemberFormFields';

type Props = {
  // Define your props here
}

const TeamMembers: React.FC<Props> = ({ }) => {
  // const { data } = useFetchTeamMembers();
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const { mutate: createMember } = useCreateTeamMember(closeModal);

  const submitHandler = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as unknown as {
      username: string;
      email: string;
      password: string;
      role?: 'member' | 'admin';
    };
    createMember(data);
  }
  // console.log(data,'here')
  return (
    <div>
      <Header text='Team Members' rightContent={
        <Button variant="default" size="sm" onClick={openModal}>
          Add Team Member
        </Button>
      } />
      <NoData />
      {/* {data?.data.length === 0 ? <NoData /> : <div>hi this is list</div>} */}
      <ModalForm
        open={isOpen}
        onOpenChange={setIsOpen}
        formTitle="Create Team Member"
        submitHandler={submitHandler}
      >
        <CreateTeamMemberFormFields/>
      </ModalForm>
    </div>
  );
};

export default TeamMembers;