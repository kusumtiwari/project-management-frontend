import Header from '@/components/elements/heading/Header';
import { Button } from '@/components/ui/button';
import ModalForm from '@/components/ui/ModalForm';
import { useModal } from '@/hooks/useModal';
import React, { useEffect, useMemo, useState } from 'react';
import { useCreateTeam, useCreateTeamMember, useFetchMembersByTeam, useFetchTeamMembers } from './useTeamMembersActions';
import NoData from '@/components/elements/no-data/NoData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateTeamMemberFormFields } from './InviteTeamMemberFormFields';

type Props = {
  // Define your props here
}

const TeamMembers: React.FC<Props> = ({ }) => {
  const { data: teamsResp, refetch: refetchTeams } = useFetchTeamMembers();
  const teams = useMemo(() => (teamsResp as any)?.data?.data || [], [teamsResp]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedTeamId && teams?.length > 0) {
      setSelectedTeamId(teams[0]._id);
    }
  }, [teams, selectedTeamId]);

  const { data: membersResp } = useFetchMembersByTeam(selectedTeamId);
  const members = useMemo(() => (membersResp as any)?.data?.data || [], [membersResp]);

  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const memberModal = { isOpen, openModal, closeModal, setIsOpen };
  const { isOpen: isTeamOpen, openModal: openTeamModal, closeModal: closeTeamModal, setIsOpen: setIsTeamOpen } = useModal();

  const { mutate: createMember } = useCreateTeamMember(() => {
    memberModal.closeModal();
    if (selectedTeamId) {
      // refetch members implicitly via query key change by toggling state if needed
    }
  });
  const { mutate: createTeam } = useCreateTeam(() => {
    closeTeamModal();
    refetchTeams();
  });

  const submitMemberHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      username: string;
      email: string;
      password: string;
      roleId: string;
      teamId?: string;
    };
    createMember(data);
  };

  const submitTeamHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { name: string };
    createTeam({ name: data.name });
  };

  return (
    <div className='space-y-4'>
      <Header text='Team Members' rightContent={
        <div className='flex gap-2'>
          <Button variant="outline" size="sm" onClick={openTeamModal}>Create Team</Button>
          <Button variant="default" size="sm" onClick={openModal}>Add Team Member</Button>
        </div>
      } />

      <div className='flex items-center gap-3'>
        <span>Select Team</span>
        <select
          className='border rounded px-2 py-1'
          value={selectedTeamId || ''}
          onChange={(e) => setSelectedTeamId(e.target.value || undefined)}
        >
          {teams.map((t: any) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <span className='text-sm text-gray-600 dark:text-gray-300'>Members: {members.length}</span>
      </div>

      {members.length === 0 ? (
        <NoData />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m: any) => {
              const teamInfo = (m.teams || []).find((t: any) => t.teamId === selectedTeamId);
              return (
                <TableRow key={m._id}>
                  <TableCell>{m.username}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{teamInfo?.role || 'member'}</TableCell>
                  <TableCell>{teamInfo?.joinedAt ? new Date(teamInfo.joinedAt).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <ModalForm
        open={isOpen}
        onOpenChange={setIsOpen}
        formTitle="Create Team Member"
        submitHandler={submitMemberHandler}
      >
        <CreateTeamMemberFormFields/>
      </ModalForm>

      <ModalForm
        open={isTeamOpen}
        onOpenChange={setIsTeamOpen}
        formTitle="Create Team"
        submitHandler={submitTeamHandler}
      >
        <div className='space-y-2 mt-4'>
          <label htmlFor='team_name'>Team Name</label>
          <input id='team_name' name='name' className='w-full border rounded px-3 py-2' placeholder='e.g. Engineering' required />
        </div>
      </ModalForm>
    </div>
  );
};

export default TeamMembers;