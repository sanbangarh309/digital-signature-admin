// import Dashboard from "views/Dashboard/Dashboard";
// import UserProfile from "views/UserProfile/UserProfile";
// import TableList from "views/TableList/TableList";
import Docs from "views/Docs";
import Signers from "views/Signers";
import Users from "views/Users";
import Prices from "views/Prices";
// import Typography from "views/Typography/Typography";
import Icons from "views/Icons/Icons";
// import Maps from "views/Maps/Maps";
// import Notifications from "views/Notifications/Notifications";

const dashboardRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "pe-7s-graph",
  //   component: Dashboard
  // },
  {
    path: "/docs",
    name: "Docs",
    icon: "pe-7s-file",
    component: Docs
  },
  {
    path: "/signers",
    name: "Signers",
    icon: "pe-7s-users",
    component: Signers
  },
  {
    path: "/users",
    name: "Users",
    icon: "pe-7s-users",
    component: Users
  },
  {
    path: "/prices",
    name: "Prices",
    icon: "pe-7s-cash",
    component: Prices
  },
  // {
  //   path: "/user",
  //   name: "User Profile",
  //   icon: "pe-7s-user",
  //   component: UserProfile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "pe-7s-news-paper",
  //   component: Typography
  // },
  { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons },
  // { path: "/maps", name: "Maps", icon: "pe-7s-map-marker", component: Maps },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "pe-7s-bell",
  //   component: Notifications
  // },
  { redirect: true, path: "/", to: "/docs", name: "Docs" }
];

export default dashboardRoutes;
