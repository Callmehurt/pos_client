import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {fetchMedias} from "../../redux/actions/galleryAction";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px dashed #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 200,
  height: 200,
  padding: 4,
  boxSizing: 'border-box',
  position: 'relative'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const btn = {
  height: '30px',
  width: '30px',
  borderRadius: '50%',
  background: 'white',
  position: 'absolute',
  right: '5px',
  border: '1px solid white',
  display: 'grid',
  placeItems: 'center'
}


const Dropzone = (props) => {

  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFiles((prev) => ([...prev, ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))]))
    }
  });

  const removeFile = file => () => {
    const newFiles = [...files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <button style={btn} onClick={removeFile(file)}><FontAwesomeIcon icon={faXmark}/></button>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);


  const notifySuccess = (message) => {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }

  const notifyError = (message) => {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }


  const [loading, setLoading] = useState(false);

  const uploadMedia = async () => {
    if(files.length === 0){
      notifyError('File not found upload')
      return null
    }
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('media', file)
    })

    try{
      const response = await axiosPrivate.post('/admin/upload-media', formData).catch((err) => {
        console.log(err)
      });
      if(response.status === 200){
        notifySuccess(response.data.message)
        setLoading(false);
        setFiles([]);
        const images = [...props.images, ...response.data.data]
        dispatch(fetchMedias(images));
      }else {
        console.log(response)
        notifyError(response.data.message)
        console.log(response.data.message)
      }
    }catch (e){
      console.log(e)
    }

  }


  return (
    <>
      <div {...getRootProps({className: 'dropzone'})} style={{display: 'grid', placeItems: 'center'}}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside style={thumbsContainer}>
          {thumbs}
        </aside>
        {
          loading ? (
              <button className={'btn btn-sm btn-primary'}><FontAwesomeIcon icon={faSpinner}/> Loading</button>
          ): (
              <button className={'btn btn-sm btn-primary'} onClick={uploadMedia}><FontAwesomeIcon icon={faUpload}/> Upload</button>
          )
        }
    </>
  );
}

export default Dropzone;