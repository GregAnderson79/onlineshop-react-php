import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function Orders(props) {

    const [orders, setOrders] = useState({
        orders: '',
        loading: '',
        error: ''
    })

    // API get orders
    useEffect(() => {
        async function FN_apiGetOrders() {
            setOrders(prev => ({...prev, loading:true}))
            await axios.post(props.apiURL, {func: 'Get Orders'})
                .then(results => setOrders(prev => ({...prev, orders:results.data})))
                .catch(err => {
                    setFormError(true)
                    toast.error('Error: ' + err)
                })
                .finally(setOrders(prev => ({...prev, loading:false})))
        }
        FN_apiGetOrders()
    }, [])

    return (
        <div className="popup_bg">
            <div className="popup_big_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Manage Orders</div>
                <div className="popup_pad popup_pnl_v3">
                    { orders.loading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        orders.error ? (
                            <div className="error">
                                <span>Error: { orders.errorMsg }</span>
                            </div>
                        ) : (
                            <div>
                                <ul className="order_list">
                                    <li>
                                        <ul>
                                            <li><b>Order</b></li>
                                            <li><b>Name</b></li>
                                            <li><b>Contact details</b></li>
                                            <li><b>Address</b></li>
                                            <li><b>Items</b></li>
                                            <li><b>Total</b></li>
                                            <li><b>Status</b></li>
                                        </ul>
                                    </li>
                                    { orders.orders && orders.orders.map((order) => (
                                            <li key={ order.orderID }>
                                                <ul>
                                                    <li>
                                                        <span className="cart_hide">Order ID: </span>
                                                        { order.orderID }
                                                    </li>
                                                    <li>{ order.firstName } { order.lastName }</li>
                                                    <li>
                                                        { order.email } 
                                                        <span className="cart_br">{ order.tel }</span>
                                                    </li>
                                                    <li>
                                                        { order.address1 }, 
                                                        <span className="cart_br">{ order.address2 }, </span>
                                                        <span className="cart_br">{ order.address2 }, </span>
                                                        <span className="cart_br">{ order.towncity }, </span>
                                                        <span className="cart_br">{ order.county } </span>
                                                        <span className="cart_br">{ order.postcode } </span>        
                                                    </li>
                                                    <li>
                                                        { order.items && order.items.map((item, index) => (
                                                            <span key={ index }>
                                                                { item.quantity } x 
                                                                (item ID { item.itemID }) 
                                                                { item.itemName } 
                                                                @ { item.itemPrice }...

                                                                { item.options.length > 0 && (
                                                                    <>
                                                                        <span>
                                                                            <span className="cart_br">Options:
                                                                                { item.options.map((value, key, index) => (
                                                                                    <span key={ index }>({ key } = { value })</span>
                                                                                ))}
                                                                            </span>
                                                                        </span>
                                                                        <br /><br />
                                                                    </>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </li> 
                                                    <li>
                                                        <span className="cart_hide">Total: </span>
                                                        { order.total }
                                                    </li>
                                                    <li>
                                                        <span className="cart_hide">Status: </span>
                                                        { order.orderStatus }
                                                    </li> 
                                                </ul>
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
export default Orders