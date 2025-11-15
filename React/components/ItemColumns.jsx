import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import BeatLoader from 'react-spinners/BeatLoader'

function ItemColumns(props) {

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

    // delete item
    async function FN_apiDeleteItem(itemID) {
        if (confirm('Are you sure you want to delete this item?')) {
            await axios.post(props.apiURL, {func: 'Delete Item', itemID: itemID})
                .then(result => {
                    toast.success('Item deleted')
                    props.openSubCat ? (
                        props.FN_apiGetItems(props.openSubCat)
                    ) : (
                        props.openMainCat && props.FN_apiGetItems(props.openMainCat)
                    )
                })
                .catch(err => toast.error('Item could not be deleted: ' + err))
        }
    }

    return (
        <>
            <section id="mainCats">
                <div className="column_ttl column_ttl_dark">Main categories</div>
                <div className="column_content">
                    {props.mainCats.loading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1" />
                        </div>
                    ) : (
                        props.mainCats.error ? (
                            <div className="error">
                                <span>Error loading main categories</span>
                            </div>
                        ) : (
                            <>
                                <div className="column_opts">
                                    { props.mainCats.length > 1 ? (
                                        <Link to="/category/order" className="nav_grey">Re-order categories</Link>
                                    ) : (
                                        <span className="grey_disabled">Re-order categories</span>
                                    )}
                                    <Link to="/category/add" className="nav_green">Add category</Link>
                                </div>
                                <div className="column_list">
                                    <ul>
                                        { props.mainCats.data && props.mainCats.data.map((mainCat) => (
                                            <li key={mainCat.catID}>
                                                <span>
                                                    <span>
                                                        <a onClick={() => props.FN_openMainCat(mainCat.catID)}>{ mainCat.catName }</a>
                                                        {mainCat.catStatus === "hidden" && <span className="cat_hidden">(hidden)</span> }
                                                    </span>
                                                    <span className="column_li_opts"> 
                                                        <Link to={`/category/edit/${mainCat.catID}`} className="nav_grey">Edit</Link>
                                                        {mainCat.canDelete ? (
                                                            <a onClick={() => FN_apiDeleteCat(mainCat.catID)} className="nav_red">Delete</a>
                                                        ) : (
                                                            <span className="red_disabled">Delete</span>
                                                        )}
                                                    </span>
                                                </span>
                                            </li>
                                        )) }
                                    </ul>
                                </div>
                            </>
                        )
                    )}
                </div>
            </section>
            { props.openMainCat &&
                <section id="subCats">
                    <div className="column_ttl_light">
                        <span className="column_hdr_arrow">&#10140;</span>
                        { props.column2Title.loading ? (
                            <span><BeatLoader color="#1E5D80" size="10px" /></span>
                        ) : (
                            props.column2Title.error ? (
                                <span>Error: { props.column2Title.errorMsg }</span>
                            ) : (
                                <span>Sub-categories in { props.column2Title.name }</span>
                            )
                        )}
                    </div>
                    <div className="column_content">
                        { props.subCats.loading ? (
                            <div className="loading">
                                <BeatLoader color="#65A0C1"/>
                            </div>
                        ) : (
                            props.subCats.error ? (
                                <div className="error">
                                    <span>Error: { props.subCats.errorMsg }</span>
                                </div>
                            ) : (
                                <>
                                    <div className="column_opts">
                                        { props.subCats.length > 1 ? (
                                            <Link to={`/category/order/${props.openMainCat}`} className="nav_grey">Re-order categories</Link>
                                        ) : (
                                            <span className="grey_disabled">Re-order categories</span>
                                        )}
                                        <Link className="nav_green" to={`/category/add/${props.openMainCat}`}>Add category</Link>
                                    </div>
                                    <div className="column_list">
                                        <ul>
                                            { props.subCats.data && props.subCats.data.map((subCat) => (
                                                <li key={subCat.catID}>
                                                    <span>
                                                        <span><a onClick={() => props.FN_openSubCat(subCat.catID)}>{ subCat.catName }</a></span>
                                                        <span className="column_li_opts">
                                                            <Link to={`/category/edit/${subCat.catID}`} className="nav_grey">Edit</Link>
                                                            { subCat.canDelete ? (
                                                                <a onClick={() => FN_apiDeleteCat(subCat.catID)} className="nav_red">Delete</a>
                                                            ) : (
                                                                <span className="red_disabled">Delete</span>
                                                            )}
                                                        </span>
                                                    </span>
                                                </li>
                                            ))}   
                                        </ul>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </section>     
            }
            { (props.openMainCat || props.openSubCat) &&
                <section id="items">
                    <div className="column_ttl_lighter">
                        <span className="column_hdr_arrow">&#10140;</span>
                        { props.column3Title.loading ? (
                            <span><BeatLoader color="#1E5D80" size="10px" /></span>
                        ) : (
                            props.column3Title.error ? (
                                <span>Error: { props.column3Title.errorMsg }</span>
                            ) : (
                                <span>Items in { props.column3Title.name }</span>
                            )
                        )}
                    </div>
                    <div className="column_content">
                        { props.items.loading ? (
                                <div className="loading">
                                    <BeatLoader color="#65A0C1"/>
                                </div>
                        ) : (
                            props.items.error ? (
                                <div className="error">
                                    <span>Error: { props.items.errorMsg }</span>
                                </div>
                            ) : (
                                <>
                                    <div className="column_opts align_right">
                                        <Link to={`/item/add/${props.openMainCat}`} className="nav_green">Add item</Link>
                                    </div>
                                    <div className="column_list">
                                        <ul>
                                            { props.items.data && props.items.data.map((item) => (
                                                <li key={item.itemID}>
                                                    <span>
                                                        <span>{ item.itemName }</span>
                                                        <span className="column_li_opts">
                                                            <Link to={`/item/edit/${item.itemID}`} className="nav_grey">Edit</Link>
                                                            <Link to={`/item/images/${item.itemID}`} className="nav_grey">Images</Link>
                                                            <Link to={`/item/options/${item.itemID}`} className="nav_grey">Options</Link>
                                                            <a onClick={() => FN_apiDeleteItem(item.itemID)} className="nav_red">Delete</a>
                                                        </span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </section>
            }
        </>
    )
}
export default ItemColumns