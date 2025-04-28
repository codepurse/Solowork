import { ChevronDown, GripVertical } from "lucide-react";
import { useState } from "react";
import { useStore } from "../../../store/store";
import Space from "../../space";
export default function ProjectList() {
  const { useStoreProjects } = useStore();
  const { projects, setSelectedProject } = useStoreProjects();
  const [activeProject] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const projectList = projects;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      setShowProjects(!showProjects);
    }
  };

  const handleProjectClick = async (projectId) => {
    setSelectedProject(projectId);
  };

  return (
    <div
      className="dropdown-projects"
      onClick={() => setShowProjects(!showProjects)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <Space gap={10} align="evenly">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/image/logo.png" className="img-fluid logo" />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <label className="project-name">
              {projectList[activeProject]?.name}
            </label>
          </div>
        </div>
        <i>
          <ChevronDown size={17} color="#fff" />
        </i>
      </Space>
      {showProjects && (
        <div className="projects-list">
          <p className="switch-project">Switch Project</p>
          {projectList?.map((project) => (
            <div
              key={project.id}
              className="project-item"
              onClick={() => {
                handleProjectClick(project.$id);
              }}
            >
              <i>
                <GripVertical size={14} color="#fff" />
              </i>
              <span>{project?.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
