import errorLayout from "~/layouts/errorLayout";
import MainLayout from "~/layouts/mainLayout";
import ChangePassword from "~/pages/admin/Authenticate/ChangePassword";
import ForgotPassword from "~/pages/admin/Authenticate/ForgotPassword";
import Login from "~/pages/admin/Authenticate/login";
import CreateFile from "~/pages/admin/CreateFile";
import CreateUser from "~/pages/admin/CreateUser";
import Dashboard from "~/pages/admin/Dashboard";
import ManageFile from "~/pages/admin/ManageFile";
import Profile from "~/pages/admin/Profile";
import Report from "~/pages/admin/Report";
import ReportDetail from "~/pages/admin/ReportDetail";
import UpdateSoundConcentration from "~/pages/admin/UpdateSoundConcentration";
import UpdateSoundDone from "~/pages/admin/UpdateSouneDone";
import UpdateTheme from "~/pages/admin/UpdateTheme";
import UpdateUserPage from "~/pages/admin/UpdateUser";
import Page404 from "~/pages/errorPages/404";
function getRoutes(isLoggedIn){
    const AppRoutes = [
        { path: '/*', component: Page404, layout: errorLayout },
        {path:'/forgot-password', component: ForgotPassword, layout:errorLayout},
        {path:'/change-password', component: ChangePassword, layout:errorLayout},
        { path: '/', component: Login, layout: errorLayout }
      ];
      
      if (isLoggedIn) {
        AppRoutes.pop()
        AppRoutes.push({ path: '/', component: Dashboard, layout: MainLayout })
        AppRoutes.push({ path: '/dashboard', component: Dashboard, layout: MainLayout })
        AppRoutes.push({ path: '/update/user/:id', component: UpdateUserPage, layout: MainLayout })
        AppRoutes.push({ path: '/create/user/*', component: CreateUser, layout: MainLayout })
        AppRoutes.push({ path: '/create/user/*', component: CreateUser, layout: MainLayout })
        AppRoutes.push({ path: '/profile', component: Profile, layout: MainLayout })
        AppRoutes.push({ path: '/report', component: Report, layout: MainLayout })
        AppRoutes.push({ path: '/report/:id', component: ReportDetail, layout: MainLayout })
        AppRoutes.push({ path: '/files', component: ManageFile, layout: MainLayout })
        AppRoutes.push({ path: '/files/update/THEME/:id', component: UpdateTheme, layout: MainLayout })
        AppRoutes.push({ path: '/files/update/SOUNDDONE/:id', component: UpdateSoundDone, layout: MainLayout })
        AppRoutes.push({ path: '/files/update/SOUNDCONCENTRATION/:id', component: UpdateSoundConcentration, layout: MainLayout })
        AppRoutes.push({ path: '/files/create', component: CreateFile, layout: MainLayout })
      }
    return AppRoutes
}

export default getRoutes