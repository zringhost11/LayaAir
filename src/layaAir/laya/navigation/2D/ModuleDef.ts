import { ClassUtils } from "../../utils/ClassUtils";
import { Nav2DAgent } from "./component/Nav2DAgent";
import { NavMesh2D } from "./NavMesh2D";
import { Navigation2DManage } from "./Navigation2DManage";
import { Navgiation2DUtils } from "./Navgiation2DUtils";
import { NavMesh2DSurface } from "./component/NavMesh2DSurface";
import { NavMesh2DObstacles } from "./NavMesh2DObstacles";
import { NavMesh2DLink } from "./NavMesh2DLink";
import { NavMesh2DModifierArea } from "./NavMesh2DModifierArea";

let c = ClassUtils.regClass;

c("Navgiation2DUtils", Navgiation2DUtils);
c("NavigationManager", Navigation2DManage);

c("Nav2DAgent", Nav2DAgent);
c("NavMesh2D", NavMesh2D);
c("NavMesh2DSurface", NavMesh2DSurface);
c("NavMesh2DLink", NavMesh2DLink);
c("NavMesh2DModifierArea", NavMesh2DModifierArea);
c("NavMesh2DObstacles", NavMesh2DObstacles);
