import {useDispatch} from "react-redux";
import {fetchMedias} from "../../redux/actions/galleryAction";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";


const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
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
  position: 'relative',
    flex: '1 0 calc(25% - 10px)'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
    width: '100%'
};

const img = {
  display: 'block',
  width: '100%',
  height: '100%',
    objectFit: 'contain'
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

const Gallery = ({images}) => {

    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const medias = images;


    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

     const removeFile = async (file) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/media/${file._id}`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newFiles = [...medias]
                 newFiles.splice(newFiles.indexOf(file), 1)
                 dispatch(fetchMedias(newFiles))
             }
         }catch (e){
             notifyError('Error encountered')
             console.log(e)
         }
      }

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

    return (
        <>
            <div style={thumbsContainer}>
                {
                    Object.keys(medias).length < 1 ? (
                        <>
                            <h1>No media</h1>
                        </>
                    ): (
                        medias.map((file, index) => {
                        return (
                            <div style={thumb} key={file._id}>
                              <div style={thumbInner} className={'img-thumbnail'}>
                                  <button style={btn} onClick={() => removeFile(file)}><FontAwesomeIcon icon={faXmark}/></button>
                                <img
                                  src={`data:image/png;base64,${arrayBufferToBase64(file.image.data)}`}
                                  style={img}
                                  onLoad={() => { URL.revokeObjectURL(arrayBufferToBase64(file.image.data)) }}
                                />
                              </div>
                            </div>
                        )
                    })
                    )
                }
            </div>
        </>
    )
}

export default Gallery;