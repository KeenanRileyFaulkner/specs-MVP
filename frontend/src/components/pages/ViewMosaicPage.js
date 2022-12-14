import axios from "axios";
import { useEffect, useState } from "react";

const ViewMosaicPage = ({ userId }) => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get(`/api/user/${userId}/projects`)
            .then(res => {
                const tempArrForProjectIds = [...res.data];
                const tempArrForProjectEndpoints = [];
                tempArrForProjectIds.forEach(id => tempArrForProjectEndpoints.push(`/api/project/${id}`));

                axios.all(tempArrForProjectEndpoints.map(endpoint => axios.get(endpoint)))
                    .then(axios.spread((...responses) => {
                        const tempArrForProjectObjects = []
                        responses.forEach(response => tempArrForProjectObjects.push(response.data)); 
                        setProjects(tempArrForProjectObjects);
                    }))
                    .catch(errors => errors.forEach(err => console.log(err)));
            });
    }, []);

    return (
        <div className="main-content-container flex justify-center items-center">
            {projects.map(project => {
                return <ProjectCard projectName={project.projectTitle} numPhotos={project.numPhotos} key={project.projectTitle} />
            })}
        </div>
    )
}

const ProjectCard = ({ projectName, numPhotos }) => {
    return (
        <div className="project-card">
            <h2>{projectName}</h2>
            <h4>Number of photos in project: {numPhotos}</h4>
            <h6>Under construction. Check back later.</h6>
        </div>
    )
}

export default ViewMosaicPage;