import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";
import axios from "axios"
import { useState, useEffect, useRef } from 'react'
import { AiOutlinePlus as PlusIcon } from 'react-icons/ai'
import { BsFillArrowLeftCircleFill as LeftArrowCircle, BsFillArrowRightCircleFill as RightArrowCircle } from 'react-icons/bs';

const Photos = ({userId}) => {
    const [currPhoto, setCurrPhoto] = useState("");
    const [currIndex, setCurrIndex] = useState(0);
    const [allPhotoIds, setAllPhotoIds] = useState([]);
    const [allPhotoSources, setAllPhotoSources] = useState([]);

    const incrIndex = e => {
        e.preventDefault();
        if(currIndex < allPhotoSources.length - 1) {
            setCurrIndex(currIndex + 1);
        } else {
            setCurrIndex(0);
        }
        setCurrPhoto(allPhotoSources[currIndex]);
    }

    const decrIndex = e => {
        e.preventDefault();
        if(currIndex > 0) {
            setCurrIndex(currIndex - 1);
        } else if (allPhotoSources.length > 0) {
            setCurrIndex(allPhotoSources.length - 1);
        } else {
            setCurrIndex(0);
        }
        setCurrPhoto(allPhotoSources[currIndex]);
    }

    useEffect(() => {
        axios.get(`/api/user/${userId}/photos`)
            .then(res => {
                setAllPhotoIds(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const tempImageUrls = []
        allPhotoIds.forEach(id => {
            axios.get(`/api/photos/${id}`, {
                responseType: 'blob',
            })
                .then(res => {
                    const imgUrl = URL.createObjectURL(res.data);
                    tempImageUrls.push(imgUrl);
                })
                .catch(err => console.log(err));
        });
        setAllPhotoSources(tempImageUrls);
        setCurrPhoto(allPhotoSources[0]);
    }, [allPhotoIds]);

    // useEffect(() => {
    //     console.log(allPhotoSources);
    //     setCurrPhoto(allPhotoSources[currIndex]);
    // }, [allPhotoSources]);

    return (
        <div className="main-content-container flex flex-col justify-center items-center">
            <div className="flex">
                <button onClick={decrIndex}>
                    <LeftArrowCircle className="arrow-circle"/>
                </button>
                
                <PhotoContainer currPhoto={currPhoto} />

                <button onClick={incrIndex}>
                    <RightArrowCircle className="arrow-circle"/>
                </button>
            </div>
            
            <AddPhotoButton userId={userId} setAllPhotoIds={setAllPhotoIds} allPhotoIds={allPhotoIds} />
        </div>
    )
}

const PhotoContainer = ({ currPhoto }) => {
    return (
        <div className="group max-h-[350px] max-w-[350px] min-w-[300px] min-h-[300px] relative">
            <img src={currPhoto} className="photo-display group group-hover:opacity-30 bg-gray-400 h-[100%] w-[100%]" alt="" id="photoOnDisplay" />
            
            <button className="photo-container-button group-hover:opacity-100">
                View Tags
            </button>
            
            <button className="photo-container-button group-hover:opacity-100">
                Delete Image
            </button>
        </div>
    )
}

const AddPhotoButton = ({ userId, setAllPhotoIds, allPhotoIds }) => {
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
                console.log("all photo ids", allPhotoIds);
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