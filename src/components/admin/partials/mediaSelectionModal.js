import {Modal} from "react-bootstrap";
import React from "react";
import {useSelector} from "react-redux";



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
    objectFit: 'contain',
    cursor: 'pointer'
};

const MediaSelectionModal = ({ mediaShow, setMediaShow, changeMedia}) => {

    const images = useSelector((state) => state.gallery.gallery);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


    const setPreview = (file) => {
        const preview = arrayBufferToBase64(file.image.data);
        changeMedia(file._id, preview);
    }

    return (
        <>
          <Modal
            show={mediaShow}
            onHide={() => setMediaShow(false)}
            size={'lg'}
            centered
            aria-labelledby=""
          >
            <Modal.Header>
               <h5 className="modal-title mt-0">Choose Media</h5>
                <button type="button" className="close" onClick={() => setMediaShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                {
                    mediaShow ? (
                        <div style={thumbsContainer}>
                {
                    Object.keys(images).length < 1 ? (
                        <>
                            <h1>No media</h1>
                        </>
                    ): (
                        images.map((file, index) => {
                            return (
                                <div style={thumb} key={file._id}>
                                  <div style={thumbInner} className={'img-thumbnail'}>
                                    <img
                                      src={`data:image/png;base64,${arrayBufferToBase64(file.image.data)}`}
                                      style={img}
                                      onLoad={() => { URL.revokeObjectURL(arrayBufferToBase64(file.image.data)) }}
                                      onClick={() => setPreview(file)}
                                    />
                                  </div>
                                </div>
                            )
                    })
                    )
                }
            </div>
                    ): null
                }
            </Modal.Body>
          </Modal>
        </>
    )
}

export default MediaSelectionModal;