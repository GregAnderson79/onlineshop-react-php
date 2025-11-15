import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import BeatLoader from 'react-spinners/BeatLoader'

function OrderCategories(props) {

    // par ID
    const { parID } = useParams()
    let mainOrSub
    parID ? mainOrSub = 'sub-' : mainOrSub = 'main '

    async function FN_changePos(e, catID, dir) {
        e.preventDefault()
        parID ? props.setSubCats(prev => ({...prev, loading:true})) : props.setMainCats(prev => ({...prev, loading:true}))

        await axios.post(props.apiURL, {func: 'Update Category Order', catID: catID, dir: dir})
            .then(result => FN_changeResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(() => {
                parID ? props.setSubCats(prev => ({...prev, loading:false})) : props.setMainCats(prev => ({...prev, loading:false}))
            })
    }

    // handle api response
    function FN_changeResponse(result) {
        if (result === 'updated') {
            parID ? props.openSubCat && props.FN_apiGetSubCats(props.openSubCat) : props.FN_apiGetMainCats()
        } else if (result === 'error not found') {
            toast.error('Categories not found')
        } else {
            toast.error('Category could not be moved')
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Re-order { mainOrSub }categories</div>
                <div className="popup_pad popup_pnl_v2">
                    { props.orderCats.loading ? (
                        <div className="popup_loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        props.orderCats.error ? (
                            <div className="popup_error">
                                <span>Error: { props.orderCats.errorMsg }</span>
                            </div>
                        ) : (
                            <div className="popup_list">
                                <ul>
                                    { props.orderCats.data && props.orderCats.data.map((cat) => (
                                        <li key={ cat.catID }>
                                            { cat.catName }
                                            <span className="column_li_opts">
                                                <a onClick={(e) => FN_changePos(e, cat.catID, 'up')} aria-label={`Move the ${cat.catName} category up 1 position`} className="nav_grey">Up</a>
                                                <a onClick={(e) => FN_changePos(e, cat.catID, 'down')} aria-label={`Move the ${cat.catName} category down 1 position`} className="nav_grey">Down</a>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
export default OrderCategories