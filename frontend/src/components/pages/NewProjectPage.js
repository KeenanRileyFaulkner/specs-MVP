import axios from "axios";
import { useEffect, useState } from "react";
import { BsCheckCircleFill as SelectedIcon, BsFillCircleFill as Circle } from 'react-icons/bs';


const NewProjectPage = ({ userId }) => {

    const [imageIds, setImageIds] = useState([]);
    const [imageEndpoints, setImageEndpoints] = useState([]);
    const [imageSources, setImageSources] = useState([]);

    useEffect(() => {
        axios.get(`/api/user/${userId}/photos`)
            .then(res => {
                setImageIds(res.data);
                const tempArrForImageIds = res.data;
                const tempArrForEndpoints = [];
                tempArrForImageIds.forEach(id => {
                    tempArrForEndpoints.push(`/api/photos/${id}`);
                });
                setImageEndpoints(tempArrForEndpoints);
                
                axios.all(tempArrForEndpoints.map((endpoint) => axios.get(endpoint, { responseType: 'blob' })))
                    .then(axios.spread((...responses) => {
                        const tempArrayForUris = [];
                        responses.forEach(response => {
                            const imgUrl = URL.createObjectURL(response.data);
                            tempArrayForUris.push(imgUrl);
                        });
                        setImageSources(tempArrayForUris);
                    })).catch(errors => {
                        errors.forEach(err => console.log(err));
                    });
            })
            .catch(err => console.log(err));
    }, [])
    return (
        <div className="main-content-container flex flex-col justify-center items-center">
            {(imageSources.map(image => {
                return <ProjectPhoto image={image} />;
            }))}
        </div>
    )
}

const ProjectPhoto = ({ image }) => {

    const [selected, setSelected] = useState(false);

    const toggleSelected = e => {
        setSelected(!selected);
    }

    return (
        <div className={`project-photo-container ${selected ? "bg-white bg-opacity-50" : ""}`} onClick={toggleSelected}>
            <img src={image} className={`bg-gray-400 ${selected ? "opacity-90" : ""}`} />
            
            <div className={`${selected ? "visible" : "hidden"} check-mark`}>
                <SelectedIcon className="selected-icon" />
                <Circle className="selected-icon-background" />
            </div>
        </div>
    )
}

export default NewProjectPage;