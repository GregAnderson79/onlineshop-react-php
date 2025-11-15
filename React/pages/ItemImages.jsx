import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function ItemImages(props) {

    // item ID
    const { itemID } = useParams()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [imgs, setImgs] = useState({
        imgs: [],
        loading: false,
        error: false
    })
    const [altTag, setAltTag] = useState()
    const [caption, setCaption] = useState()
    const [btnClass, setBtnClass] = useState('btn_locked')
    const [uplFile, setUplFile] = useState()


    // API get images
    async function FN_apiGetImgs() {
        setImgs(prev => ({...prev, loading:true}))
        await axios.post(props.apiURL, {func: 'Get Images', itemID: itemID})
            .then(results => setImgs(prev => ({...prev, imgs:results.data})))
            .catch(err => setImgs(prev => ({...prev, error:true, errorMsg:err})))
            .finally(setImgs(prev => ({...prev, loading:false})))
    }

    useEffect(() => {
        FN_apiGetImgs()
    }, [])

    // validate image selection, unlock form
    useEffect(() => {
        if (typeof uplFile !== 'undefined' && uplFile !== null) {
            setBtnClass('')
        }
    }, [uplFile])


    // set image to 'main'
    function FN_setMainImg(imgID, itemID) {
        setImgs(prev => ({...prev, loading:true}))
        axios.post(props.apiURL, {func: 'Set Main Image', imgID: imgID, itemID: itemID})
            .then(() => FN_apiGetImgs(itemID))
            .catch(err => toast.error('Image could not be set as main image: ' + err))
            .finally(setImgs(prev => ({...prev, loading:false})))
    }


    // delete image
    function FN_deleteImg(imgID, imgName) {
        if (confirm('Are you sure you want to delete this image?')) {
            setImgs(prev => ({...prev, loading:true}))
            axios.post(props.apiURL, {func: 'Delete Image', imgID: imgID, imgName: imgName})
                .then(() => {
                    toast.success('Image deleted')
                    FN_apiGetImgs(itemID)
                })
                .catch(err => toast.error('Image could not be deleted: ' + err))
                .finally(setImgs(prev => ({...prev, loading:false})))
        }
    }


    // API send image
    async function FN_imgSend() {
        setFormLoading(true)
        setImgs(prev => ({...prev, loading:true}))
        const formData = new FormData()
            formData.append('image', uplFile, uplFile.name)
            formData.append('func', 'Upload Image')
            formData.append('itemID', itemID)
            formData.append('altTag', altTag)
            formData.append('caption', caption)
            await axios.post(props.apiURL, formData)
                .then(() => FN_apiGetImgs(itemID))
                .catch(err => toast.error('Error: ' + err))
                .finally(() => {
                    setFormLoading(false)
                    setImgs(prev => ({...prev, loading:false}))
                })
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Manage item images</div>
                <div className="popup_pad popup_pnl_v3">
                    <div className="popup_form">
                        { formLoading ? (
                            <div className="loading">
                                <BeatLoader color="#1E5D80" />
                            </div>
                        ) : (
                            <>
                                <p>
                                    <label htmlFor="file">Upload image</label>
                                    <span><input type="file" id="file" accept=".jpg,.jpeg,.png,.gif,.webp" onChange={(e) => setUplFile(e.target.files[0])} /></span>
                                </p>
                                <p>
                                    <label htmlFor="altTag">Alt tag</label>
                                    <input type="text" name="altTag" id="altTag" value={altTag} onChange={(e) => setAltTag(e.target.value)} />
                                </p>
                                <p>
                                    <label htmlFor="caption">Caption</label>
                                    <input type="text" name="caption" id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
                                </p>
                                <p className={btnClass}><button className="btn_blue" onClick={FN_imgSend}>Upload</button></p>
                            </>
                        )}
                    </div>

                    <div className="popup_gallery popup_list">
                        { imgs.loading ? (
                            <div className="loading">
                                <BeatLoader color="#1E5D80" />
                            </div>
                        ) : (
                            imgs.error ? (
                                <div className="error">
                                    <span>Error loading images</span>
                                </div>
                            ) : (
                                <ul>
                                    { imgs.imgs && imgs.imgs.map((img, index) => (
                                        <li key={index}>
                                            <span className={ img.isMain && 'main_item_img'}>
                                                { img.isMain ? <span>✔</span> : "" }
                                                <img src={`https://www.greganderson.co.uk/shop/itemImages/thumb_${img.imgName}`} alt={img.altTag} />
                                            </span>
                                            <span className="column_li_opts">
                                                { img.isMain ? (
                                                    <span className="grey_disabled">Main image</span>
                                                ) : (
                                                    <a onClick={() => FN_setMainImg(img.imgID, itemID)} className="nav_grey">Set to main</a>
                                                )}
                                                <a onClick={() => FN_deleteImg(img.imgID, img.imgName)} className="nav_red">Delete</a>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ItemImages