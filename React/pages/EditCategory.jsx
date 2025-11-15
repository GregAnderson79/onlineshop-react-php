import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function EditCategory(props) {

    // navigate
    const navigate = useNavigate()

    // cat ID
    const { catID } = useParams()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(false)
    const [catName, setCatName] = useState({
        name: '',
        class: ''
    })
    const [parID, setParID] = useState({
        id: 0,
        class: ''
    })
    const [catStatus, setCatStatus] = useState()
    const [catDesc, setCatDesc] = useState()
    const [btnClass, setBtnClass] = useState('btn_locked')


    // get cat data
    useEffect(() => {
        async function FN_apiGetCatData() {
            setFormLoading(true)
            await axios.post(props.apiURL, {func: 'Get Category', catID: catID})
                .then(results => FN_useCatData(results.data))
                .catch(err => {
                    setFormError(true)
                    toast.error('Error: ' + err)
                })
                .finally(setFormLoading(false))
        }
        FN_apiGetCatData()
    }, [])

    // use cat data
    function FN_useCatData(data) {
        if (typeof data === 'undefined' || data === null) {
            setFormError(true)
            toast.error('Category could not be found')
        } else {
            setCatName(prev => ({...prev, name:data.catName}))
            setParID(prev => ({...prev, id:data.parID}))
            setCatStatus(data.catStatus)
            setCatDesc(data.catDesc)
        }
    }


    // name validation
    useEffect(() => {
        if (catName.name.length > 0 && catName.name.length < 3) {
            setCatName(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setCatName(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [catName.name])

    // lock/unlock form button
    function FN_formLock() {
        if (catName.name.length >= 3) {
            setBtnClass('')
        } else {
            setBtnClass('btn_locked')
        }
    }
    

    // submit form
    async function FN_apiSubmit(e) {
        e.preventDefault()
        setFormLoading(true)
        await axios.post(props.apiURL, {func: 'Update Category', catName: catName.name, parID: parID.id, catStatus: catStatus, catDesc: catDesc, catID: catID})
            .then(result => FN_submitResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setFormLoading(false))
    }

    // handle api response
    function FN_submitResponse(result) {
        if (result === 'updated') {
            toast.success('Category updated')
            props.FN_apiGetMobNav()
            props.FN_apiGetMainCats()
            props.openSubCat ? (
                props.FN_apiGetSubCats(props.openSubCat)
            ) : (
                props.openMainCat && props.FN_apiGetSubCats(props.openMainCat)
            )
            return navigate('/')
        } else if (result === 'error name') {
            toast.error('Category names must have at least 3 characters')
        } else if (result === 'error self') {
            toast.error('Categories cannot be put inside themselves')
        } else if (result === 'error not found') {
            toast.error('Category not found')
        } else {
            toast.error('Category could not be updated')
        }
    }
    
    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Edit category</div>
                <div className="popup_pad popup_pnl_v2">
                    { formLoading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (

                        <div className={formError ? 'popup_form popup_error' : 'popup_form'}>
                            <form onSubmit={FN_apiSubmit}>
                            <p>
                                <label htmlFor="catName">Category name</label>
                                <span className={catName.class}>
                                    <input type="text" name="catName" id="catName" value={catName.name} onChange={(e) => setCatName(prev => ({...prev, name:e.target.value}))} />
                                    <span className="ipt_hint_msg">Minimum 3 characters</span>
                                </span>
                            </p>
                            <p>
                                { props.mainCats.loading ? (
                                    <BeatLoader color="#1E5D80" size="10px" />
                                ) : (
                                    <>
                                        <label htmlFor="parID">Parent main category</label>
                                        <span className={parID.class}>
                                            <select name="parID" id="parID" value={parID.id} onChange={(e) => setParID(prev => ({...prev, id:e.target.value}))}>
                                                <option value="0">No parent (new top level category)</option>
                                                { props.mainCats.data && props.mainCats.data.map((mainCat) => (
                                                    <option key={mainCat.catID} value={mainCat.catID}>{mainCat.catName}</option>
                                                ))}
                                            </select>
                                        </span>
                                    </>
                                )}
                            </p>
                            <p>
                                <label htmlFor="catStatus">Category status</label>
                                <span>
                                    <select name="catStatus" id="catStatus" value={catStatus} onChange={(e) => setCatStatus(e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="hidden">Hidden</option>
                                    </select>
                                </span>
                            </p>
                            <p>
                                <label className="cat_desc_lbl" htmlFor="catDesc">Category description</label>
                                <span><textarea name="catDesc" id="catDesc" value={catDesc} onChange={(e) => setCatDesc(e.target.value)}></textarea></span>
                            </p>
                            <p className={btnClass}><button className="btn_blue">Submit</button></p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default EditCategory