import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";
import axios from "axios"
import { useState, useEffect, useRef } from 'react'
import { AiOutlinePlus as PlusIcon } from 'react-icons/ai'
import { BsFillArrowLeftCircleFill as LeftArrowCircle, BsFillArrowRightCircleFill as RightArrowCircle } from 'react-icons/bs';

const Photos = ({userId}) => {
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
    }, []);

    return (
        <div className="main-content-container flex flex-col justify-center items-center">
            <div className="flex">
                <button onClick={decrIndex}>
                    <LeftArrowCircle className="arrow-circle"/>
                </button>
                
                <PhotoContainer currPhoto={imageSources[currentImageIndex]} />

                <button onClick={incrIndex}>
                    <RightArrowCircle className="arrow-circle"/>
                </button>
            </div>
            
            <AddPhotoButton 
                userId={userId} 
                setAllPhotoIds={setImageIds} 
                allPhotoIds={imageIds} 
                setImageEndpoints={setImageEndpoints}
                imageEndpoints={imageEndpoints}
                setImageSources={setImageSources}
                imageSources={imageSources}
                setCurrentImageIndex={setCurrentImageIndex}
            />
        </div>
    )
}

const PhotoContainer = ({ currPhoto }) => {
    return (
        <div className="group max-h-[350px] max-w-[350px] min-w-[300px] min-h-[300px] relative hover:bg-gray-400">
            <img src={currPhoto} className="photo-display group-hover:opacity-30 h-[100%] w-[100%]" alt="" id="photoOnDisplay" />
            
            <button className="photo-container-button group-hover:opacity-100">
                View Tags
            </button>
            
            <button className="photo-container-button group-hover:opacity-100">
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



export default Photos;