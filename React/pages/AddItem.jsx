import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function AddItem(props) {

    // navigate
    const navigate = useNavigate()

    // initial cat ID
    let { iniCatID } = useParams()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [itemName, setItemName] = useState({
        name: '',
        class: ''
    })
    const [catID, setCatID] = useState({
        id: iniCatID,
        class: ''
    })
    const [itemPrice, setItemPrice] = useState({
        price: '',
        class: ''
    })
    const moneyRegex = /^\d+\.?\d{0,2}?$/;
    const [itemStatus, setItemStatus] = useState("active")
    const [itemStock, setItemStock] = useState({
        stock: 0,
        class: ''
    })
    const [itemDesc1, setItemDesc1] = useState()
    const [itemDesc2, setItemDesc2] = useState()
    const [itemDesc3, setItemDesc3] = useState()
    const [btnClass, setBtnClass] = useState("btn_locked")

    useEffect(() => {
        props.FN_apiGetAllCats()
    }, [])


    // validation
    // name
    useEffect(() => {
        if (itemName.name.length > 0 && itemName.name.length < 3) {
            setItemName(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setItemName(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [itemName.name])

    // price
    useEffect(() => {
        if (itemPrice.price.length > 0 && !moneyRegex.test(itemPrice.price)) {
            setItemPrice(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setItemPrice(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [itemPrice.price])

    // stock
    useEffect(() => {
        if (itemStock.stock.length > 0 && !Number.isInteger(+itemStock.stock)) {
            setItemStock(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setItemStock(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [itemStock.stock])

    // lock/unlock form button
    function FN_formLock() {
        if (itemName.name.length >= 3 && 
            itemPrice.price.length > 0 && moneyRegex.test(itemPrice.price) && 
            Number.isInteger(+itemStock.stock)
        ) {
            setBtnClass('')
        } else {
            setBtnClass('btn_locked')
        }
    }


    // API add item
    async function FN_apiSubmit(e) {
        e.preventDefault()
        setFormLoading(true)
        await axios.post(props.apiURL, {func: 'Add Item', itemName: itemName.name, catID: catID.id, itemPrice: itemPrice.price, itemStatus: itemStatus, itemStock: itemStock.stock, itemDesc1: itemDesc1, itemDesc2: itemDesc2, itemDesc3: itemDesc3})
            .then(result => FN_submitResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setFormLoading(false))
    }

    // handle api response
    function FN_submitResponse(result) {
        if (result === 'added') {
            toast.success('Item added')
            props.openSubCat ? (
                props.FN_apiGetItems(props.openSubCat)
            ) : (
                props.openMainCat && props.FN_apiGetItems(props.openMainCat)
            )
            return navigate('/')
        } else if (result === 'error name') {
            toast.error('Item names must have at least 3 characters')
        } else if (result === 'error price') {
            toast.error('Item prices must be numbers with a 2 optional decimal places')
        } else if (result === 'error stock') {
            toast.error('Stock level must be a number')
        } else {
            toast.error('Item could not be added')
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Add item</div>
                <div className="popup_pad popup_pnl_v2">
                    { formLoading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        <div className="popup_form">
                            <form onSubmit={FN_apiSubmit}>
                            <p>
                                <label htmlFor="itemName">Item name</label>
                                <span className={itemName.class}>
                                    <input type="text" name="itemName" id="itemName" value={itemName.name} onChange={(e) => setItemName(prev => ({...prev, name:e.target.value}))} />
                                    <span className="ipt_hint_msg">Minimum 3 characters</span>
                                </span>
                            </p>
                            <p>
                                { props.allCats.loading ? (
                                    <BeatLoader color="#1E5D80" size="10px" />
                                ) : (
                                    <>
                                        <label htmlFor="catID">Category</label>
                                        <span className={catID.class}>
                                            <select name="catID" id="catID" value={catID.id} onChange={(e) => setCatID(prev => ({...prev, id:e.target.value}))}>
                                                { props.allCats.data && props.allCats.data.map((cat) => (
                                                    <option key={cat.catID} value={cat.catID}>{cat.catName}</option>
                                                ))}
                                            </select>
                                        </span>
                                    </>
                                )}
                            </p>
                            <p>
                                <label htmlFor="itemPrice">Item price</label>
                                <span className={itemPrice.class}>
                                    <input type="text" name="itemPrice" id="itemPrice" value={itemPrice.price} onChange={(e) => setItemPrice(prev => ({...prev, price:e.target.value}))} />
                                    <span className="ipt_hint_msg">Number formatted to 2 decimal places</span>
                                </span>
                            </p>
                            <p>
                                <label htmlFor="itemStatus">Item status</label>
                                <span>
                                    <select name="itemStatus" id="itemStatus" value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="hidden">Hidden</option>
                                    </select>
                                </span>
                            </p>
                            <p>
                                <label htmlFor="itemStock">Item stock</label>
                                <span className={itemStock.class}>
                                    <input type="text" name="itemStock" id="itemStock" value={itemStock.stock} onChange={(e) => setItemStock(prev => ({...prev, stock:e.target.value}))} />
                                    <span className="ipt_hint_msg">Number required</span>
                                </span>
                            </p>
                            <p>
                                <label className="cat_desc_lbl" htmlFor="itemDesc1">Main item description</label>
                                <span>
                                    <textarea name="itemDesc1" id="itemDesc1" value={itemDesc1} onChange={(e) => setItemDesc1(e.target.value)} />
                                </span>
                            </p>
                            <p>
                                <label className="cat_desc_lbl" htmlFor="itemDesc2">Second description</label>
                                <span>
                                    <textarea name="itemDesc2" id="itemDesc2" className="item_desc_100" value={itemDesc2} onChange={(e) => setItemDesc2(e.target.value)} />
                                </span>
                            </p>
                            <p>
                                <label className="cat_desc_lbl" htmlFor="itemDesc3">Third description</label>
                                <span>
                                    <textarea name="itemDesc3" id="itemDesc3" className="item_desc_100" value={itemDesc3} onChange={(e) => setItemDesc3(e.target.value)} />
                                </span>
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
export default AddItem