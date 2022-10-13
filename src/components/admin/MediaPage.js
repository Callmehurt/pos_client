import Dropzone from "./Dropzone";
import Gallery from "./Gallery";
import {useDispatch, useSelector} from "react-redux";
import {fetchMedias} from "../../redux/actions/galleryAction";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {faPhotoFilm} from "@fortawesome/free-solid-svg-icons";

const MediaPage = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const images = useSelector((state) => state.gallery.gallery);


    const fetchMediaData = async () => {
        try {
            const response = await axiosPrivate.get('/admin/fetch/all-media');
            dispatch(fetchMedias(response.data));
            return response.data;
        }catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchMediaData();
    }, [])


    // const notify = (message) => {
    //   toast(message, {
    //       position: "top-center",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       });
    // }

    return (
        <>
            <div className="page-title-box">
                <div className="row align-items-center">
                    <div className="col-sm-12">
                        <ol className="breadcrumb float-right">
                            <li className="breadcrumb-item active">Medias</li>
                        </ol>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <ul className="nav nav-pills nav-justified" role="tablist">
                        <li className="nav-item waves-effect waves-light">
                            <a className="nav-link active" data-toggle="tab" href="#gallery" role="tab">
                                <span className="d-none d-md-block">Gallery</span><span className="d-block d-md-none">
                                    <FontAwesomeIcon icon={faPhotoFilm}/>
                            </span>
                            </a>
                        </li>
                        <li className="nav-item waves-effect waves-light">
                            <a className="nav-link" data-toggle="tab" href="#dropzone" role="tab">
                                <span className="d-none d-md-block">Upload</span><span className="d-block d-md-none">
                                <FontAwesomeIcon icon={faUpload}/>
                            </span>
                            </a>
                        </li>
                    </ul>
                    <div className="tab-content">
                         <div className="tab-pane active p-3 pt-3" id="gallery" role="tabpanel">
                            <Gallery images={images}/>
                        </div>
                        <div className="tab-pane p-3 pt-3" id="dropzone" role="tabpanel">
                            <Dropzone images={images}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MediaPage;