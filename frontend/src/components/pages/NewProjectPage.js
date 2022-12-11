import axios from "axios";
import { useEffect, useState } from "react";
import { BsCheckCircleFill as SelectedIcon, BsFillCircleFill as Circle } from 'react-icons/bs';
import { HiOutlineArrowNarrowLeft as PreviousButton, HiOutlineArrowNarrowRight as NextButton } from 'react-icons/hi';


const NewProjectPage = ({ userId }) => {

    //page state
    const [imageIds, setImageIds] = useState([]);
    const [imageSources, setImageSources] = useState([]);
    const [currStage, setCurrStage] = useState(1);
    const [mainPhoto, setMainPhoto] = useState({});
    const [tilePhotos, setTilePhotos] = useState([]);
    const [projectTitle, setProjectTitle] = useState("");
    const [processedProject, setProcessedProject] = useState(false);
    const [startNewProject, setStartNewProject] = useState(false);

    //method to increment through steps of creating a project
    const handleNextStage = e => {
        if (currStage === 1) {
            if(mainPhoto.mainPhoto === undefined) {
                alert("You must choose a main photo for your project");
                return;
            } else {
                setCurrStage(currStage + 1);
            }
        } else if (currStage === 2) {
            if(tilePhotos.length < 10) {
                alert("You must choose at least 10 tile photos for your mosaic. Upload more photos if you need to.");
                return;
            } else {
                setCurrStage(currStage + 1);
            }
        } else if (currStage === 3) {
            if(projectTitle === "") {
                alert("You must designate a title for your project.");
                return;
            } else {
                setCurrStage(currStage + 1);
            }
        }
    }

    //method to revert to previous step in creating a project
    const handlePrevStage = e => {
        if(currStage > 1) {
            setCurrStage(currStage - 1);
        }
    }

    //this effect gets the photos from the backend when the page loads.
    useEffect(() => {
        setCurrStage(1);
        axios.get(`/api/user/${userId}/photos`)
            .then(res => {
                setImageIds(res.data);
                const tempArrForImageIds = res.data;
                const tempArrForEndpoints = [];
                tempArrForImageIds.forEach(id => {
                    tempArrForEndpoints.push(`/api/photos/${id}`);
                });
                
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
    }, []);

    //this effect tracks the overall status of the post request body.
    //if the reqBody is valid and the page is in the correct stage, it submits it to the backend through axios.
    useEffect(() => {
        if(currStage !== 4) {
            return;
        }
        if(mainPhoto.mainPhoto === undefined || tilePhotos.length < 10 || projectTitle === "") {
            alert("There are some problems with your project. Check that you have a main photo, at least 10 tile photos, and a project name.");
            setProcessedProject(false);
            return;
        }

        console.log("made it this far");
        const reqBody = {};
        reqBody.mainPhoto = mainPhoto.mainPhoto;
        reqBody.tilePhotos = tilePhotos;
        reqBody.projectTitle = projectTitle;
        reqBody.userId = userId;

        axios.post(`/api/project`, reqBody)
            .then(() => {
                setProcessedProject(true);
            })
            .catch((err) => {
                setProcessedProject(false);
                console.log(err);
            });
    }, [mainPhoto, tilePhotos, projectTitle, currStage]);


    //this helps make sure that mainPhotos cannot become tile photos as well. Could probably use refactoring. 
    //Was not updated after setting requirements for moving between stages.
    const [imageSourcesForTiles, setImageSourcesForTiles] = useState(imageSources);
    const [imageIdsForTiles, setImageIdsForTiles] = useState(imageIds);
    useEffect(() => {
        if(mainPhoto.mainPhoto !== undefined) {
            const tempArrForSources = [...imageSources];
            tempArrForSources.splice(imageIds.indexOf(mainPhoto.mainPhoto), 1);
            const tempArrForIds = [...imageIds];
            tempArrForIds.splice(imageIds.indexOf(mainPhoto.mainPhoto), 1);
            setImageIdsForTiles(tempArrForIds);
            setImageSourcesForTiles(tempArrForSources);
        } else {
            setImageSourcesForTiles(imageSources);
            setImageIdsForTiles(imageIds);
        }
    }, [mainPhoto.mainPhoto]);

    //useEffect to reset the stages if that button is selected
    useEffect(() => {
        if(currStage !== 4) {
            return;
        }

        if (startNewProject) {
            setCurrStage(1);
        }
    }, [startNewProject]);

    
    return (
        <div className="main-content-container flex flex-col justify-center items-center">
            <div className="project-creation-container">

                <h2 className="step-instructions">{currStage === 1 ? "Step 1: Choose a main photo" 
                    : currStage === 2 ? "Step 2: Choose tile photos" 
                    : "Step 3: Add Project Info"}
                </h2>

                <ProgressBar currStage={currStage} processedProject={processedProject} />

                { currStage === 1 ?
                    <PhotoContainerMainSelect imageSources={imageSources} setMainPhoto={setMainPhoto} imageIds={imageIds}/>
                  : currStage === 2 ? 
                    <PhotoContainerTileSelect imageSources={imageSourcesForTiles} imageIds={imageIdsForTiles} setTilePhotos={setTilePhotos} />
                  : currStage === 3 ? 
                    <MetaDataForm numTiles={tilePhotos.length} setProjectTitle={setProjectTitle} />
                  : <ProcessedProjectInfo processApproved={processedProject} setStartNewProject={setStartNewProject} />
                }

                <div className="stage-change-container">
                    <div className={`stage-change-button ${currStage <= 1 ? "disabled" : ""}`} onClick={handlePrevStage}>
                        <PreviousButton className="text-white" size="30"/>
                    </div>

                    <div className={`stage-change-button ${currStage > 3 ? "disabled" : "" }`} onClick={handleNextStage}>
                        <NextButton className="text-white" size="30"/>
                    </div>
                </div>
            </div>            
        </div>
    )
}

const PhotoContainerMainSelect = ({ imageSources, setMainPhoto, imageIds }) => {

    const [photoSelectionArray, setPhotoSelectionArray] = useState(new Array(imageSources.length).fill(false));
    const [currSelection, setCurrSelection] = useState(-1);

    const setSelected = (index) => {
        const arr = new Array(imageSources.length).fill(false);
        if (index != -1) { arr[index] = true; }
        setPhotoSelectionArray(arr);
    }

    useEffect(() => {
        setMainPhoto({"mainPhoto": imageIds[currSelection]});
    }, [currSelection]);

    useEffect(() => {
        setSelected(currSelection);
    }, [currSelection]);

    return (
        <div className="all-photos-container">
            {(imageSources.map((image, index) => {
                return (
                    <MainProjectPhoto 
                        image={image} 
                        selected={photoSelectionArray[index]} 
                        indexNum={index} 
                        setCurrSelection={setCurrSelection}
                        key={image}
                    />
                );
            }))}
        </div>
    )
}

const MainProjectPhoto = ({ image, selected, indexNum, setCurrSelection }) => {

    const toggleSelected = e => {
        if(selected) {
            setCurrSelection(-1);
        } else {
            setCurrSelection(indexNum);
        }
    }

    return (
        <div className={`project-photo-container ${selected ? "bg-white bg-opacity-50 border-gray-100 border-[10px]" : ""}`} 
            onClick={toggleSelected}
        >
            <div className={`image-wrapper ${selected ? "image-selected" : ""}`}>
                <img src={image} alt="" className={`bg-gray-400 ${selected ? "opacity-90" : ""}`} />
            </div>
            
            <div className={`${selected ? "visible" : "hidden"} check-mark`}>
                <SelectedIcon className="selected-icon" />
                <Circle className="selected-icon-background" />
            </div>
        </div>
    )
}

const PhotoContainerTileSelect = ({ imageSources, imageIds, setTilePhotos }) => {

    const [photoSelectionArray, setPhotoSelectionArray] = useState(new Array(imageSources.length).fill(false));

    useEffect(() => {
        const selectedPhotoIds = [];
        photoSelectionArray.forEach((photo, index) => {
            if(photo) {
                selectedPhotoIds.push(imageIds[index]);
            }
        });
        setTilePhotos(selectedPhotoIds);
    }, [photoSelectionArray]);


    return (
        <div className="all-photos-container">
            {(imageSources.map((image, index) => {
                return (<TileProjectPhoto 
                        image={image} 
                        selected={photoSelectionArray[index]} 
                        indexNum={index} 
                        setPhotoSelectionArray={setPhotoSelectionArray}
                        photoSelectionArray={photoSelectionArray} 
                        key={image}
                        />);
            }))}
        </div>
    )
}

const TileProjectPhoto = ({selected, image, indexNum, setPhotoSelectionArray, photoSelectionArray}) => {

    const toggleSelected = () => {
        const tempArr = [...photoSelectionArray];
        const currVal = tempArr[indexNum]
        tempArr[indexNum] = !currVal;
        setPhotoSelectionArray(tempArr);
    }

    return (
        <div className={`project-photo-container ${selected ? "bg-white bg-opacity-50 border-gray-100 border-[10px]" : ""}`} 
            onClick={toggleSelected}
        >
            <div className={`image-wrapper ${selected ? "image-selected" : ""}`}>
                <img src={image} alt="" className={`bg-gray-400 ${selected ? "opacity-90" : ""}`} />
            </div>
            
            <div className={`${selected ? "visible" : "hidden"} check-mark`}>
                <SelectedIcon className="selected-icon" />
                <Circle className="selected-icon-background" />
            </div>
        </div>
    )
}

const ProgressBar = ({ currStage, processedProject }) => {

    return (
        <div className="progress-bar-background">
            <div className={`progress-bar 
                ${currStage === 1 ? "w-[100px]" : 
                currStage === 2 ? "w-[350px]" : 
                currStage === 3 ? "w-[600px]" :
                "w-[100%]" }

                ${currStage === 4 && !processedProject ? "bg-red-500" : "bg-green-500"}
                
                `} 
            />
            <StageNumber number={1} currStage={currStage} processedProject={processedProject} />
            <StageNumber number={2} currStage={currStage} processedProject={processedProject} />
            <StageNumber number={3} currStage={currStage} processedProject={processedProject} />
        </div>
    );
}

const StageNumber = ({ number, currStage, processedProject }) => {

    return (
        <div className="stage-number-container">
            <Circle size="50" 
                className={`stage-number-circle 
                    ${currStage < number ? "text-gray-400" : 
                    currStage === 4 && !processedProject ? "text-red-500" : 
                    "text-green-500"}`
                }
            />
            <h4 className="stage-number">{number}</h4>
        </div>
    )
}

const MetaDataForm = ({ numTiles, setProjectTitle }) => {
    
    const handleChange = (e) => {
        e.preventDefault();
        const input = document.getElementById("project-name");
        setProjectTitle(input.value);
    }

    return (
        <div className="project-form-container">
            <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="project-name">Project Name:</label>
                <input type="text" required id="project-name" onChange={handleChange} />
            </form>
            <h2 className="num-tiles-header">Number of photos to use as tiles: {numTiles}</h2>
        </div>
    )
}

const ProcessedProjectInfo = ({ processApproved, setStartNewProject }) => {

    const [displayMessage, setDisplayedMessage] = useState("");
    useEffect(() => {
        setStartNewProject(false);
        if(processApproved) {
            setDisplayedMessage("Your project was submitted Successfully!");
        } else {
            setDisplayedMessage("An error occurred while processing your project. Please try again later.");
        }
    }, [processApproved]);

    const handleClick = e => {
        e.preventDefault();
        setStartNewProject(true);
    }

    return (
        <div className="project-submission-info">
            <h2>{displayMessage}</h2>
            {processApproved ? <button className="start-new-project-button" onClick={handleClick}>Start a new project</button> : ""}
        </div>
    );
}

export default NewProjectPage;