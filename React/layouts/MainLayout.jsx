import { Outlet } from 'react-router-dom'   
import Header from '../components/Header'
import MobileNav from '../components/MobileNav'
import ItemColumns from '../components/ItemColumns'
import OptionColumn from '../components/OptionColumn'
import ManageColumn from '../components/ManageColumn'

function MainLayout(props) {

    return (
        <>
            <Header />
            <MobileNav 
                apiURL={props.apiURL} 
                mobCats={props.mobCats}
                FN_apiGetMobNav={props.FN_apiGetMobNav}
                FN_apiGetMainCats={props.FN_apiGetMainCats}
                FN_openMainCat={props.FN_openMainCat}
                FN_apiGetSubCats={props.FN_apiGetSubCats} 
                FN_openSubCat={props.FN_openSubCat}
            />
            <main>
                <ItemColumns
                    apiURL={props.apiURL} 
                    FN_apiGetMobNav={props.FN_apiGetMobNav}
                    mainCats={props.mainCats}
                    FN_apiGetMainCats={props.FN_apiGetMainCats}
                    openMainCat={props.openMainCat}
                    FN_openMainCat={props.FN_openMainCat}
                    column2Title={props.column2Title}
                    subCats={props.subCats}
                    FN_apiGetSubCats={props.FN_apiGetSubCats} 
                    openSubCat={props.openSubCat}
                    items={props.items}
                    FN_openSubCat={props.FN_openSubCat}
                    column3Title={props.column3Title}
                    FN_apiGetItems={props.FN_apiGetItems}
                />
                <OptionColumn
                    apiURL={props.apiURL} 
                    FN_apiGetOptions={props.FN_apiGetOptions}
                    options={props.options}
                    setOptions={props.setOptions}
                />
                <ManageColumn />
            </main>
            <Outlet />
        </>
    )
}
export default MainLayout