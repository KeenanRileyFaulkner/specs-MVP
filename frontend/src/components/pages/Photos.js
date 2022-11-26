import axios from "axios"
import { useState, useEffect } from 'react'

const Photos = () => {
    const [currPhoto, setCurrPhoto] = useState("");
    const [currIndex, setCurrIndex] = useState(0);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        axios.get(`/api/user/${userId}/photos`)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }, [])

    return (
        <div className="main-content-container flex justify-center items-center">
            <PhotoContainer />
        </div>
    )
}

const PhotoContainer = () => {
    return (
        <div className="border-white border-2 rounded-lg h-[500px] w-[400px]">

        </div>
    )
}



export default Photos;