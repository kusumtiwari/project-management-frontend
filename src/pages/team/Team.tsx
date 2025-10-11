import Header from '@/components/elements/heading/Header';
import { Button } from '@/components/ui/button';
import ModalForm from '@/components/ui/ModalForm';
import { useModal } from '@/hooks/useModal';
import React from 'react';
import { useFetchTeamMembers, useSendInvitation } from './useTeamMembersActions';
import NoData from '@/components/elements/no-data/NoData';
import { InviteTeamMemberFormFields } from './InviteTeamMemberFormFields';

type Props = {
  // Define your props here
}

const TeamMembers: React.FC<Props> = ({ }) => {
  // const { data } = useFetchTeamMembers();
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const { mutate: sendInvitation, isPending } = useSendInvitation(closeModal);

  const submitHandler = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      email:string;
    }
    console.log(data,'form data team');
    sendInvitation(data)
  }
  // console.log(data,'here')
  return (
    <div>
      <Header text='Team Members' rightContent={
        <Button variant="default" size="sm" onClick={openModal}>
          Invite a member
        </Button>
      } />
      <NoData />
      {/* {data?.data.length === 0 ? <NoData /> : <div>hi this is list</div>} */}
      <ModalForm
        open={isOpen}
        onOpenChange={setIsOpen}
        formTitle="Invite Team Member"
        submitHandler={submitHandler}
      >
        <InviteTeamMemberFormFields/>
      </ModalForm>
    </div>
  );
};

export default TeamMembers;