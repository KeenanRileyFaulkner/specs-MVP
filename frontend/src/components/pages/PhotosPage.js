import axios from "axios"
import { useState, useEffect, useRef } from 'react'
import { AiOutlinePlus as PlusIcon, AiOutlineClose as CloseIcon } from 'react-icons/ai'
import { BsFillArrowLeftCircleFill as LeftArrowCircle, BsFillArrowRightCircleFill as RightArrowCircle } from 'react-icons/bs';

const PhotosPage = ({userId}) => {
    const incrIndex = e => {
        e.preventDefault();
        if(currentImageIndex < imageSources.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setCurrentImageIndex(0);
        }
    }

    const decrIndex = e => {
        e.preventDefault();
        if(currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else if (imageSources.length > 0) {
            setCurrentImageIndex(imageSources.length - 1);
        } else {
            setCurrentImageIndex(0);
        }
    }

    const [imageEndpoints, setImageEndpoints] = useState([]);
    const [imageIds, setImageIds] = useState([]);
    const [imageSources, setImageSources] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [tagWindowHidden, toggleHidden] = useState(true);

    useEffect(() => {
        setCurrentImageIndex(0);
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
    }, [userId]);

    let photoContainerToDisplay;
    let photoButtonToDisplay;
    if(tagWindowHidden) {
        photoContainerToDisplay = 
            <>
                <button onClick={decrIndex}>
                    <LeftArrowCircle className="arrow-circle"/>
                </button>
                
                <PhotoContainer 
                    currPhoto={imageSources[currentImageIndex]} 
                    currPhotoId={imageIds[currentImageIndex]} 
                    imageEndpoints={imageEndpoints}
                    setImageEndpoints={setImageEndpoints}
                    imageIds={imageIds}
                    setImageIds={setImageIds}
                    imageSources={imageSources}
                    setImageSources={setImageSources}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                    toggleHidden={toggleHidden}
                />

                <button onClick={incrIndex}>
                    <RightArrowCircle className="arrow-circle"/>
                </button>
            </>

        photoButtonToDisplay = 
            <AddPhotoButton 
                userId={userId} 
                setAllPhotoIds={setImageIds} 
                allPhotoIds={imageIds} 
                setImageEndpoints={setImageEndpoints}
                imageEndpoints={imageEndpoints}
                setImageSources={setImageSources}
                imageSources={imageSources}
                setCurrentImageIndex={setCurrentImageIndex}
                hidden={tagWindowHidden}
            />
    } else {
        photoContainerToDisplay = <TagWindow setTagWindowHidden={toggleHidden} currentImageId={imageIds[currentImageIndex]}/>
        photoButtonToDisplay=<></>
    }

    return (
        <div className="main-content-container flex flex-col justify-center items-center">
            <div className="flex">
                {photoContainerToDisplay}
            </div>
            
            {photoButtonToDisplay}
        </div>
    )
}

const TagWindow = ({ setTagWindowHidden, currentImageId }) => {
    const closeWindow = e => {
        e.preventDefault();
        setTagWindowHidden(true);
    }

    const [imageTags, setImageTags] = useState([]);

    useEffect(() => {
        axios.get(`/api/photos/${currentImageId}/tags`)
            .then(res => {
                setImageTags(res.data);
            })
            .catch(err => console.log(err));
    }, [currentImageId]);

    const handleTagAdd = e => {
        e.preventDefault();
        let input = document.getElementById('new-tag-name');

        if(/\s/.test(input.value)) {
            alert("Tags cannot include any whitespace");
            return;
        }

        axios.post(`/api/tag/${input.value}/photo/${currentImageId}`)
            .then(() => {
                const tempArr = [...imageTags, input.value];
                setImageTags(tempArr);
                input.value="";
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="h-[350px] w-[500px] bg-gray-300 rounded-md pb-5">
            <CloseIcon className="tag-window-close" onClick={closeWindow} size='18'/>
            <form onSubmit={handleTagAdd}>
                <input type='text' required placeholder="Enter new tag here" className="tag-window-input" id="new-tag-name"/>
            </form>
            <div className="tag-display-area">
                {imageTags.map(tag => {
                    return <Tag tag={tag} photoId={currentImageId} imageTags={imageTags} setImageTags={setImageTags} />
                })}
            </div>
        </div>
    )
}

const Tag = ({tag, photoId, imageTags, setImageTags}) => {
    const handleDelete = e => {
        e.preventDefault();
        axios.delete(`/api/tag/${tag}/photo/${photoId}`)
            .then(() => {
                const tempArr = [...imageTags]
                tempArr.splice(imageTags.indexOf(tag), 1)
                setImageTags(tempArr);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="tag">
            <h4 className="w-fit mr-2">{tag}</h4>
            <CloseIcon className="tag-remove" title="Delete tag" onClick={handleDelete} />
        </div>
    )
}

const PhotoContainer = ({ currPhoto, currPhotoId, currentImageIndex, imageEndpoints, setImageEndpoints, imageSources, setImageSources,
    setCurrentImageIndex, imageIds, setImageIds, toggleHidden }) => {

    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`/api/photos/${currPhotoId}`)
            .then(() => {
                //remove the image id from state
                let tempArrForImageIds = [...imageIds];
                tempArrForImageIds.splice(currentImageIndex, 1);
                setImageIds(tempArrForImageIds);

                //remove the image source from state
                let tempArrForImageSources = [...imageSources];
                tempArrForImageSources.splice(currentImageIndex, 1);
                setImageSources(tempArrForImageSources);

                //remove the image endpoint from state
                let tempArrForImageEndpoints = [...imageEndpoints];
                tempArrForImageEndpoints.splice(currentImageIndex, 1);
                setImageEndpoints(tempArrForImageEndpoints);

                //set the current image index to 0
                setCurrentImageIndex(0);
            })
            .catch(err => console.log(err));
    }

    const displayTags = e => {
        e.preventDefault();
        toggleHidden(false);
    }

    let conditionalPhotoDisplay;
    let disableHoverButtons;
    if(imageSources.length > 0) {
        disableHoverButtons = false;
        conditionalPhotoDisplay = 
            <img 
                src={currPhoto} 
                className="photo-display group-hover:opacity-30 h-[100%] w-[100%]" alt="" id="photoOnDisplay" 
            />            
    } else {
        disableHoverButtons = true;
        conditionalPhotoDisplay = 
            <div className="h-[100%] w-[100%] border-white border-2 flex items-center justify-center">
                <h2 className="text-[18pt] max-w-[250px]">Upload photos to get started!</h2>
            </div>
    }
    
    return (
        <div className={`group max-h-[350px] max-w-[350px] min-w-[300px] min-h-[300px] relative ${disableHoverButtons ? '' : 'hover:bg-gray-400'}`}>
            {conditionalPhotoDisplay}
            
            <button className={`photo-container-button group-hover:opacity-100 ${disableHoverButtons ? 'hidden' : 'visible'}`}
                onClick={displayTags}
            >
                View Tags
            </button>
            
            <button 
                className={`photo-container-button group-hover:opacity-100 ${disableHoverButtons ? 'hidden' : 'visible'} `} 
                onClick={handleDelete}
            >
                Delete Image
            </button>
        </div>
    )
}

const AddPhotoButton = ({ userId, setAllPhotoIds, allPhotoIds, setImageEndpoints, 
    imageEndpoints, setImageSources, imageSources, setCurrentImageIndex }) => {
    const inputRef = useRef(null);


    const handleClick = () => {
        inputRef.current.click();
    }

    const handleFileChange = e => {
        const fileObj = e.target.files && e.target.files[0];
        if(!fileObj) {
            alert("No file was selected. Try again.");
            return;
        }

        e.target.value = null;
        const formData = new FormData();
        formData.append('mainPhoto', fileObj);

        axios.post(`/api/user/${userId}/photos`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
                const arr = [...allPhotoIds, res.data];
                setAllPhotoIds(arr);
                const newEndpoint = `/api/photos/${res.data}`;
                setImageEndpoints([...imageEndpoints, newEndpoint]);
                axios.get(newEndpoint, { responseType: 'blob' })
                    .then(image => {
                        const imgUrl = URL.createObjectURL(image.data);
                        setImageSources([...imageSources, imgUrl]);
                        setCurrentImageIndex(arr.length - 1);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

    }

    return (
        <div>
            <button className="add-photo-button" onClick={handleClick}>
                <PlusIcon className="text-white h-[20px] w-[20px]"/>
                <h4 className="font-semibold text-lg">Upload Photo</h4>
            </button>
            <input type="file" id="imgUpload" className="hidden" ref={inputRef} onChange={handleFileChange}/>
        </div>
    )
}



export default PhotosPage;