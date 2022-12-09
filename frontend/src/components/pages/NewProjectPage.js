import axios from "axios";
import { useEffect, useState } from "react";
import { BsCheckCircleFill as SelectedIcon, BsFillCircleFill as Circle } from 'react-icons/bs';


const NewProjectPage = ({ userId }) => {

    const [imageIds, setImageIds] = useState([]);
    const [imageEndpoints, setImageEndpoints] = useState([]);
    const [imageSources, setImageSources] = useState([]);
    const [currStage, setCurrStage] = useState(1);

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
            <div className="project-creation-container">
                <h2 className="step-instructions">{currStage == 1 ? "Step 1: Choose a main photo" 
                    : currStage == 2 ? "Step 2: Choose tile photos" 
                    : "Step 3: Add Project Info"}</h2>
                <ProgressBar currStage={currStage} />

                {/* Get image container in here */}
                <PhotoContainer imageSources={imageSources} />
            </div>
        </div>
    )
}

const PhotoContainer = ({ imageSources }) => {
    return (
        <div className="all-photos-container">
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
            <div className="image-wrapper"><img src={image} className={`bg-gray-400 ${selected ? "opacity-90" : ""}`} /></div>
            
            <div className={`${selected ? "visible" : "hidden"} check-mark`}>
                <SelectedIcon className="selected-icon" />
                <Circle className="selected-icon-background" />
            </div>
        </div>
    )
}

const ProgressBar = ({ currStage }) => {

    return (
        <div className="progress-bar-background">
            <div className={`progress-in-green ${currStage == 1 ? "w-[100px]" : currStage == 2 ? "w-[350px]" : "w-[600px]" }`} />
            <StageNumber number={1} currStage={currStage} />
            <StageNumber number={2} currStage={currStage} />
            <StageNumber number={3} currStage={currStage} />
        </div>
    );
}

const StageNumber = ({ number, currStage }) => {

    return (
        <div className="stage-number-container">
            <Circle size="50" className={`stage-number-circle ${currStage < number ? "text-gray-400" : "text-green-500"}`}/>
            <h4 className="stage-number">{number}</h4>
        </div>
    )
}

export default NewProjectPage;