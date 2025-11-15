import { useState } from 'react'
import { Link } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function MobileNav(props) {

    // open, close mobile nav
    const [MNstate, setMNstate] = useState('mob_nav mn_closed')

    function FN_closeMN() {
        setMNstate('mob_nav mn_closed')
    }

    function FN_openMN() {
        setMNstate('mob_nav')
    }

    // open main cat
    function FN_openMainCat(catID) {
        props.FN_openMainCat(catID)
        FN_closeMN()
    }

    // open sub cat
    function FN_openSubCat(catID) {
        props.FN_openSubCat(catID)
        FN_closeMN()
    }

    // delete category
    async function FN_apiDeleteCat(catID) {
        if (confirm('Are you sure you want to delete this category?')) {
            await axios.post(props.apiURL, {func: 'Delete Category', catID: catID})
                .then(result => {
                    toast.success('Category deleted')
                    props.FN_apiGetMobNav()
                    props.FN_apiGetMainCats()
                    props.openSubCat ? (
                        props.FN_apiGetSubCats(props.openSubCat)
                    ) : (
                        props.openMainCat && props.FN_apiGetSubCats(props.openMainCat)
                    )
                })
                .catch(err => toast.error('Category could not be deleted: ' + err))
        }
    }

    return (
        <>
            <div className="mob_nav_hgr">
                <a onClick={() => FN_openMN()} className="mob_nav_a" aria-label="Open mobile main category > sub category navigation">
                <span></span><span></span><span></span>
                </a>
            </div>
            <div className={MNstate}>
                <div className="mob_nav_hdr">
                    <Link to="/category/order" onClick={() => FN_closeMN()} className="nav_grey">Re-order categories</Link>
                    <Link to="/category/add" onClick={() => FN_closeMN()} className="nav_green">Add category</Link>    
                    <a onClick={() => FN_closeMN()} className="mob_nav_close" aria-label="Close mobile main category > sub category navigation">&#10005;</a>
                </div>
                <div className="mob_nav_scr">
                    { props.mobCats.loading ? (
                        <div className="pnl_loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        props.mobCats.error ? (
                            <div className="mob_nav_error">
                                <span>Error { props.mobCats.errorMsg }</span>
                            </div>
                        ) : (
                            <nav>
                                <ul>
                                    { props.mobCats.data && props.mobCats.data.map((mobCat, index) => (
                                        <li key={ index }>
                                            <span>
                                                <span className={ mobCat.type === "main" ? "MN_parent" : ""}>
                                                    <span>
                                                        { mobCat.type === "main" ? (
                                                            <a onClick={() => FN_openMainCat(mobCat.catID)}>{ mobCat.catName }</a>
                                                        ) : (
                                                            <a onClick={() => FN_openSubCat(mobCat.catID)}>- { mobCat.catName }</a>
                                                        )}
                                                        { mobCat.catStatus === "hidden" && <span className="cat_hidden">(hidden)</span> }
                                                    </span>
                                                    <span className="column_li_opts"> 
                                                        <Link to={`/category/edit/${mobCat.catID}`} onClick={() => FN_closeMN()} className="nav_grey">Edit</Link>
                                                        <span>
                                                            { mobCat.canDelete ? (
                                                                <a onClick={() => FN_apiDeleteCat(mobCat.catID)} className="nav_red">Delete</a>
                                                            ) : (
                                                                <span className="red_disabled">Delete</span>
                                                            )}
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )
                    )}
        
                    <div className="mob_nav_management">
                        <nav>
                            <ul>
                            <li><Link to="/orders" onClick={() => FN_closeMN()} className="MN_RouterLink">Manage Orders</Link></li>
                            <li><Link to="/admins" onClick={() => FN_closeMN()} className="MN_RouterLink">Manage admin accounts</Link></li>
                            <li><Link to="/paypal" onClick={() => FN_closeMN()} className="MN_RouterLink">Manage PayPal email</Link></li>
                            <li><Link to="/delivery" onClick={() => FN_closeMN()} className="MN_RouterLink">Manage delivery price</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MobileNav