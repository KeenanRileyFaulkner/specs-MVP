import axios from "axios";
import { useEffect, useState } from "react";
import { BsCheckCircleFill as SelectedIcon, BsFillCircleFill as Circle } from 'react-icons/bs';
import { HiOutlineArrowNarrowLeft as PreviousButton, HiOutlineArrowNarrowRight as NextButton } from 'react-icons/hi';


const NewProjectPage = ({ userId }) => {

    const [imageIds, setImageIds] = useState([]);
    const [imageEndpoints, setImageEndpoints] = useState([]);
    const [imageSources, setImageSources] = useState([]);
    const [currStage, setCurrStage] = useState(1);
    const [mainPhoto, setMainPhoto] = useState({});
    const [tilePhotos, setTilePhotos] = useState([]);

    const handleNextStage = e => {
        if(currStage < 3) {
            setCurrStage(currStage + 1);
        }
    }

    const handlePrevStage = e => {
        if(currStage > 1) {
            setCurrStage(currStage - 1);
        }
    }

    //this effect gets the photos from the backend when the page loads.
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

    //this will become the effect that maintains the request body
    useEffect(() => {
        console.log(mainPhoto);
        console.log(tilePhotos);
    }, [mainPhoto, tilePhotos]);


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

    
    return (
        <div className="main-content-container flex flex-col justify-center items-center">
            <div className="project-creation-container">

                <h2 className="step-instructions">{currStage === 1 ? "Step 1: Choose a main photo" 
                    : currStage === 2 ? "Step 2: Choose tile photos" 
                    : "Step 3: Add Project Info"}
                </h2>

                <ProgressBar currStage={currStage} />

                { currStage === 1 ?
                    <PhotoContainerMainSelect imageSources={imageSources} setMainPhoto={setMainPhoto} imageIds={imageIds}/>
                  : currStage === 2 ? 
                    <PhotoContainerTileSelect imageSources={imageSourcesForTiles} imageIds={imageIdsForTiles} setTilePhotos={setTilePhotos} />
                  : <MetaDataForm />
                }

                <div className="stage-change-container">
                    <div className={`stage-change-button ${currStage <= 1 ? "disabled" : ""}`} onClick={handlePrevStage}>
                        <PreviousButton className="text-white" size="30"/>
                    </div>

                    <div className={`stage-change-button ${currStage >= 3 ? "disabled" : "" }`} onClick={handleNextStage}>
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
                return (<MainProjectPhoto 
                        image={image} 
                        selected={photoSelectionArray[index]} 
                        indexNum={index} 
                        setCurrSelection={setCurrSelection} 
                        />);
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

    // const select = (index) => {
    //     const tempArr = [...photoSelectionArray];
    //     tempArr[index] = true;
    //     setPhotoSelectionArray(tempArr);
    // }

    // const unselect = (index) => {
    //     const tempArr = [...photoSelectionArray];
    //     tempArr[index] = false;
    //     setPhotoSelectionArray(tempArr);
    // }


    return (
        <div className="all-photos-container">
            {(imageSources.map((image, index) => {
                return (<TileProjectPhoto 
                        image={image} 
                        selected={photoSelectionArray[index]} 
                        indexNum={index} 
                        setPhotoSelectionArray={setPhotoSelectionArray}
                        photoSelectionArray={photoSelectionArray} 
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

const ProgressBar = ({ currStage }) => {

    return (
        <div className="progress-bar-background">
            <div className={`progress-in-green ${currStage === 1 ? "w-[100px]" : currStage === 2 ? "w-[350px]" : "w-[600px]" }`} />
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

const MetaDataForm = () => {

}

export default NewProjectPage;