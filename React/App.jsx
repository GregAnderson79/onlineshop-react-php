import { useState, useEffect } from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import axios from 'axios'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import AddCategory from './pages/AddCategory'
import EditCategory from './pages/EditCategory'
import OrderCategories from './pages/OrderCategories'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import ItemImages from './pages/ItemImages'
import AddOption from './pages/AddOption'
import EditOption from './pages/EditOption'
import AddOptionValue from './pages/AddOptionValue'
import EditOptionValue from './pages/EditOptionValue'
import ItemOptions from './pages/ItemOptions'
import Orders from './pages/Orders'
import Delivery from './pages/Delivery'
import PayPal from './pages/PayPal'
import Admins from './pages/Admins'
import AddAdmin from './pages/AddAdmin'
import EditAdmin from './pages/EditAdmin'
import NotFound from './pages/NotFound'
import Login from './components/Login'
import { useSelector, useDispatch } from 'react-redux'
import { saveMain } from './redux/openCats/mainSlice'
import { saveSub } from './redux/openCats/subSlice'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

  // redux
  const dispatch = useDispatch()
  const savedMainCat = useSelector((state => state.main.currentMain))
  const savedSubCat = useSelector((state => state.sub.currentSub))
  useEffect(() => {
      savedMainCat && FN_openMainCat(savedMainCat)
      savedSubCat && FN_openSubCat(savedSubCat)
  }, [])

  // api url
  const apiURL = '***************/endpoints.php'

  // API get mob cat list
  const [mobCats, setMobCats] = useState({
    data: '',
    loading: false,
    error: false,
    errorMsg: ''
  })

  async function FN_apiGetMobNav() {
    setMobCats(prev => ({...prev, loading:true}))
    await axios.post(apiURL, {func: 'Get Mobile Nav'})
      .then(results => setMobCats(prev => ({...prev, data:results.data})))
      .catch(err => setMobCats(prev => ({...prev, error:true, errorMsg:err})))
    setMobCats(prev => ({...prev, loading:false}))
  }

  useEffect(() => {
    FN_apiGetMobNav()
  }, [])


  // open main cat
  const [openMainCat, setOpenMainCat] = useState()
  function FN_openMainCat(catID) {
    setOpenMainCat(catID)
    FN_apiGetSubCats(catID)
    FN_apiGetColumn2Title(catID)
    FN_apiGetItems(catID)
    FN_apiGetColumn3Title(catID)
    dispatch(saveMain(catID))
    dispatch(saveSub(null))
  }


  // open sub cat
  const [openSubCat, setOpenSubCat] = useState()
  function FN_openSubCat(catID) {
    setOpenSubCat(catID)
    FN_apiGetItems(catID)
    FN_apiGetColumn3Title(catID)
    dispatch(saveSub(catID))
  }

  
  // API get main cats
  const [mainCats, setMainCats] = useState({
    data: '',
    length: 0,
    loading: false,
    error: false,
    errorMsg: ''
  })

  async function FN_apiGetMainCats() {
    setMainCats(prev => ({...prev, loading:true}))
    await axios.post(apiURL, {func: 'Get Main Categories'})
      .then(results => setMainCats(prev => ({...prev, data:results.data, length:results.data && results.data.length})))
      .catch(err => setMainCats(prev => ({...prev, error:true, errorMsg:err})))
    setMainCats(prev => ({...prev, loading:false}))
  }

  useEffect(() => {
    FN_apiGetMainCats()
  }, [])


  // API get sub cats
  const [subCats, setSubCats] = useState({
    data: '',
    length: 0,
    loading: false,
    error: false,
    errorMsg: ''
  })

  async function FN_apiGetSubCats(catID) {
    setSubCats(prev => ({...prev, loading:true}))
    await axios.post(apiURL, {func: 'Get Sub Categories', catID: catID})
      .then(results => setSubCats(prev => ({...prev, data:results.data, length:results.data && results.data.length})))
      .catch(err => setSubCats({error:true, errorMsg:err}))
    setSubCats(prev => ({...prev, loading:false}))
  }


  // API column 2 title (main cat ttl / null)
  const [column2Title, setColumn2Title] = useState({
    name: '',
    loading: false,
    error: false,
    errorMsg: ''
  })

  async function FN_apiGetColumn2Title(catID) {
    setColumn2Title(prev => ({...prev, loading:true}))
    await axios.post(apiURL, {func: 'Get Category Name', catID: catID})
      .then(results => setColumn2Title(prev => ({...prev, name:results.data.catName})))
      .catch(err => setColumn2Title(prev => ({...prev, error:true, errorMsg:err})))
    setColumn2Title(prev => ({...prev, loading:false}))
  }


  // API get all cats
  const [allCats, setAllCats] = useState({
    data: '',
    loading: false,
    error: false,
    errorMsg: ''
  })

  async function FN_apiGetAllCats() {
    setAllCats(prev => ({...prev, loading:true}))
    await axios.post(apiURL, {func: 'Get All Categories List'})
      .then(results => setAllCats(prev => ({...prev, data:results.data})))
      .catch(err => setAllCats(prev => ({...prev, error:true, errorMsg:err})))
    setAllCats(prev => ({...prev, loading:false}))
  }


  // API get items
  const [items, setItems] = useState({
    data: '',
    loading: false,
    error: false,
    errorMsg: ''
  })

  async function FN_apiGetItems(catID) {
    setItems(prev => ({...prev, loading:true}))
    await axios.post(apiURL, {func: 'Get Items', catID: catID})
      .then(results => setItems(prev => ({...prev, data:results.data})))
      .catch(err => setItems({error:true, errorMsg:err}))
    setItems(prev => ({...prev, loading:false}))
  }


  // API column 3 title (main / sub cat title)
  const [column3Title, setColumn3Title] = useState({
    name: '',
    loading: false,
    error: false,
    errorMsg: ''
  })

  async function FN_apiGetColumn3Title(catID) {
    setColumn3Title(prev => ({...prev, loading:true}))
    await axios.post(apiURL, {func: 'Get Category Name', catID: catID})
      .then(results => setColumn3Title(prev => ({...prev, name:results.data.catName})))
      .catch(err => setColumn3Title(prev => ({...prev, error:true, errorMsg:err})))
    setColumn3Title(prev => ({...prev, loading:false}))
  }


  // API get options
  const [options, setOptions] = useState({
    options: '',
    loading: false,
    error: false,
    errorMsg: ''
  })

  async function FN_apiGetOptions() {
      setOptions(prev => ({...prev, loading:true}))
      await axios.post(apiURL, {func: 'Get Options'})
          .then(results => setOptions(prev => ({...prev, options:results.data})))
          .catch(err => setOptions({error:true, errorMsg:err}))
      setOptions(prev => ({...prev, loading:false}))
  }


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout 
        apiURL={apiURL} 
        mobCats={mobCats}
        FN_apiGetMobNav={FN_apiGetMobNav}
        mainCats={mainCats}
        FN_apiGetMainCats={FN_apiGetMainCats}   
        openMainCat={openMainCat}
        FN_openMainCat={FN_openMainCat}
        column2Title={column2Title}
        subCats={subCats}
        FN_apiGetSubCats={FN_apiGetSubCats}
        openSubCat={openSubCat}
        items={items}
        FN_openSubCat={FN_openSubCat}
        column3Title={column3Title}
        FN_apiGetItems={FN_apiGetItems}
        FN_apiGetOptions={FN_apiGetOptions}
        options={options}
        setOptions={setOptions}
      />}>

        <Route index element={<Home />} />

        <Route path="/category/add/" element={<AddCategory 
          apiURL={apiURL}
          FN_apiGetMobNav={FN_apiGetMobNav}
          mainCats={mainCats}
          FN_apiGetMainCats={FN_apiGetMainCats}
          openMainCat={openMainCat}
          FN_apiGetSubCats={FN_apiGetSubCats} 
        />} />

        <Route path="/category/add/:iniParID" element={<AddCategory 
          apiURL={apiURL}
          FN_apiGetMobNav={FN_apiGetMobNav}
          mainCats={mainCats}
          FN_apiGetMainCats={FN_apiGetMainCats}
          openMainCat={openMainCat}
          FN_apiGetSubCats={FN_apiGetSubCats} 
        />} />

        <Route path="/category/edit/:catID" element={<EditCategory 
          apiURL={apiURL}
          FN_apiGetMobNav={FN_apiGetMobNav}
          mainCats={mainCats}
          FN_apiGetMainCats={FN_apiGetMainCats}
          openMainCat={openMainCat}
          FN_apiGetSubCats={FN_apiGetSubCats} 
        />} />

        <Route path="/category/order" element={<OrderCategories 
          apiURL={apiURL} 
          FN_apiGetMainCats={FN_apiGetMainCats}
          orderCats={mainCats}
          setMainCats={setMainCats}
        />} />

        <Route path="/category/order/:parID" element={<OrderCategories 
          apiURL={apiURL} 
          FN_apiGetSubCats={FN_apiGetSubCats} 
          orderCats={subCats}
          setSubCats={setSubCats}
        />} />

        <Route path="/item/add/:iniCatID" element={<AddItem 
          apiURL={apiURL}
          FN_apiGetAllCats={FN_apiGetAllCats}
          allCats={allCats}
          FN_apiGetItems={FN_apiGetItems}
          openMainCat={openMainCat}
          openSubCat={openSubCat}
        />} />

        <Route path="/item/edit/:itemID" element={<EditItem 
          apiURL={apiURL}
          FN_apiGetAllCats={FN_apiGetAllCats}
          allCats={allCats}
          FN_apiGetItems={FN_apiGetItems}
          openMainCat={openMainCat}
          openSubCat={openSubCat}
        />} />

        <Route path="/item/images/:itemID" element={<ItemImages
          apiURL={apiURL}
          FN_apiGetItems={FN_apiGetItems}
          openMainCat={openMainCat}
          openSubCat={openSubCat}
        />} />

        <Route path="/option/add" element={<AddOption
          apiURL={apiURL}
          FN_apiGetOptions={FN_apiGetOptions}
        />} />

        <Route path="/option/edit/:optID" element={<EditOption
          apiURL={apiURL}
          FN_apiGetOptions={FN_apiGetOptions}
        />} />

        <Route path="/option/value/add/:optID" element={<AddOptionValue
          apiURL={apiURL}
          FN_apiGetOptions={FN_apiGetOptions}
        />} />

        <Route path="/option/value/edit/:valID" element={<EditOptionValue
          apiURL={apiURL}
          FN_apiGetOptions={FN_apiGetOptions}
        />} />

        <Route path="/item/options/:itemID" element={<ItemOptions
          apiURL={apiURL}
        />} />

        <Route path="/orders" element={<Orders
          apiURL={apiURL}
        />} />

        <Route path="/delivery" element={<Delivery
          apiURL={apiURL}
        />} />

        <Route path="/paypal" element={<PayPal
          apiURL={apiURL}
        />} />

        <Route path="/admins" element={<Admins
          apiURL={apiURL}
        />} />

        <Route path="/admin/add" element={<AddAdmin
          apiURL={apiURL}
        />} />

        <Route path="/admin/edit/:adminID" element={<EditAdmin
          apiURL={apiURL}
        />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    ), 
    { basename: "/shop/admin3" }
  )

  // redux - saved login
  const savedUser = useSelector((state => state.user.currentUser))

  return (
    <>
      {savedUser ? (<RouterProvider router={router} />) : (<Login apiURL={apiURL} />)}
      <ToastContainer />
    </>
  )
}

export default App
