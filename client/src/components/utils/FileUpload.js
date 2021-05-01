import React, { useState } from 'react'
import Dropzone from 'react-dropzone';
import { Icon } from 'antd';
import Axios from 'axios';
function FileUpload(props) {

    const [Images, setImages] = useState([])

    const onDrop = async (files) => {
        
            var reg = /(.*?)\.(jpg|bmp|jpeg|png)$/;
            if(!files[0].name.match(reg))
            {
                alert("Invalid File Attached, Only images allowed.");
                setImages([]);
                props.refreshFunction([]);
                return;
            }
            else{
        
        
        let g = []

        for(let i=0;i < files.length; i++){
            console.log(files[i]);
            let formData = new FormData();
            const config = {
                header: { 'content-type': 'multipart/form-data' }
            }
        formData.append("file", files[i]);
        //save the Image we chose inside the Node Server 
        await Axios.post('/api/product/uploadImage', formData, config)
            .then(response => {
                if (response.data.success) {
                    g[i] = response.data.image;
                } else {
                    alert('Failed to save the Image in Server')
                }
            })
        }
        setImages([...Images, ...g])
        props.refreshFunction([...Images, ...g])
    }
}


    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image);

        let newImages = [...Images]
        newImages.splice(currentIndex, 1)

        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone
                onDrop={onDrop}
                multiple={true}
                maxSize={800000000}
            >
                {({ getRootProps, getInputProps }) => (
                    <div style={{
                        width: '300px', height: '240px', border: '1px solid lightgray',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                    }}
                        {...getRootProps()}
                    >
                        {/* {console.log('getRootProps', { ...getRootProps() })}
                        {console.log('getInputProps', { ...getInputProps() })} */}
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: '3rem' }} />
                        <span>Click/Drop To Add Images</span>

                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll'}}>
                {Images.length === 0 && <span style={{margin: 'auto'}}>Images will appear here after you upload</span>}
                {Images.map((image, index) => (
                    <div key={index} >
                    <Icon type="close" style={{ marginLeft: '26px' }} onClick={() => onDelete(image)}/>
                        <img style={{ minWidth: '300px', width: '300px', height: '90%', marginLeft: '30px', border: 'solid 3px black' }} src={`http://localhost:5000/${image}`} alt={`productImg-${index}`} />
                    </div>
                ))}


            </div>

        </div>
    )
}

export default FileUpload
