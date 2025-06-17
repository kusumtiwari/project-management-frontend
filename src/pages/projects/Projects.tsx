import React from 'react';
import { useFetchProjectList } from './useProjectActions';

type Props = {
  // Define your props here
}

const Projects: React.FC<Props> = ({  }) => {
  const {data:projectList} = useFetchProjectList();
  return (
    <div>
      projects
    </div>
  );
};

export default Projects;