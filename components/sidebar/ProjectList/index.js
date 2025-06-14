import { ChevronDown, GripVertical, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import { useStore } from "../../../store/store";
import Space from "../../space";
import ModalAddWorkSpace from "./ModalAddWorkSpace";

export default function ProjectList({ showSidebar }) {
  const { useStoreProjects } = useStore();
  const { projects, setSelectedProject } = useStoreProjects();
  const [activeProject, setActiveProject] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [showModalAddWorkspace, setShowModalAddWorkspace] = useState(false);
  const [edit, setEdit] = useState(false);
  const [info, setInfo] = useState({});
  const [firstRun, setFirstRun] = useState(true);
  const projectList = projects;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      setShowProjects(!showProjects);
    }
  };

  const handleProjectClick = async (projectId) => {
    console.log(projectId, "projectId");
    setSelectedProject(projectId);
    setActiveProject(projectId);
  };

  const style = { padding: showSidebar ? "6px 12px" : "4px" };

  useEffect(() => {
    console.log("activeProject", projectList[activeProject]);
  }, [projectList, activeProject]);

  useEffect(() => {
    if (projectList.length > 0 && firstRun) {
      setActiveProject(projectList[0].$id);
      setFirstRun(false);
    }
  }, [projectList]);

  return (
    <div
      className="dropdown-projects"
      onClick={() => setShowProjects(!showProjects)}
      role="button"
      tabIndex={0}
      style={style}
      onKeyDown={handleKeyDown}
    >
      <Space gap={10} align="evenly">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={
              projectList.find((project) => project.$id === activeProject)
                ?.image
            }
            className="img-fluid logo"
          />
          {showSidebar && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <label className="project-name">
                {
                  projectList.find((project) => project.$id === activeProject)
                    ?.name
                }
              </label>
            </div>
          )}
        </div>
        {showSidebar && (
          <i>
            <ChevronDown size={17} color="#fff" />
          </i>
        )}
      </Space>
      {showProjects && (
        <div className="projects-list">
          <p className="switch-project">Switch Project</p>
          {projectList
            ?.filter((project) => !project.isDeleted)
            .map((project) => (
              <Space gap={5} align="evenly" key={project.id}>
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
                <i
                  onClick={() => {
                    setEdit(true);
                    setShowModalAddWorkspace(true);
                    setInfo(project);
                  }}
                >
                  <Pencil size={12} color="#fff" />
                </i>
              </Space>
            ))}
          <div
            className="add-workspace-container mt-2"
            onClick={() => {
              setEdit(false);
              setShowModalAddWorkspace(true);
            }}
          >
            <Space gap={5}>
              <i>
                <Plus size={12} color="#fff" />
              </i>
              <p className="add-workspace">Add Workspace</p>
            </Space>
          </div>
        </div>
      )}
      <Modal
        show={showModalAddWorkspace}
        onHide={() => setShowModalAddWorkspace(false)}
        centered
        className="modal-container"
      >
        <ModalAddWorkSpace
          onHide={() => setShowModalAddWorkspace(false)}
          edit={edit}
          info={info}
        />
      </Modal>
    </div>
  );
}
