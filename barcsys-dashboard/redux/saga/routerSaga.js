import React from "react";
import { Redirect, Switch } from "react-router-dom";
import AdminPage from "../../AdminPage";
import { RouteScene } from "redux-arena";
import { NOMAL_PAGE, FULLSCREEN, ONLY_HEADER } from "../../displayModes";
import {
  FRAME_UPDATE_REFRESH,
  FRAME_SET_ROOTROUTE,
  FRAME_ROUTE_HOTREPLACE,
  FRAME_ROUTE_REFRESH
} from "../actionTypes";
import {
  takeLatest,
  takeEvery,
  take,
  put,
  call,
  fork,
  select,
  cancel
} from "redux-saga/effects";

function buildChildren(rootRoute, parentPath) {
  let children = [];
  if (rootRoute == null) return children;
  let absolutePath =
    rootRoute.path == null
      ? null
      : (parentPath + "/" + rootRoute.path.trim()).replace(/\/+/g, "/");
  if (rootRoute.indexRoutePath != null) {
    children.push(
      <Redirect
        key={absolutePath}
        exact
        from={absolutePath}
        to={rootRoute.indexRoutePath}
      />
    );
  } else if (rootRoute.asyncBundle != null) {
    let { isLoginFree, component, name, path, asyncBundle } = rootRoute;
    if (isLoginFree) {
      children.push(
        <RouteScene
          key={absolutePath}
          path={absolutePath}
          exact
          asyncSceneBundle={asyncBundle}
        />
      );
    } else {
      children.push(
        <AdminPage
          key={absolutePath}
          path={absolutePath}
          exact
          asyncSceneBundle={asyncBundle}
        />
      );
    }
  }
  if (rootRoute.childRoutes != null) {
    children = rootRoute.childRoutes
      .map(childRoute =>
        buildChildren(childRoute, absolutePath)
      )
      .reduce((prev, cur) => prev.concat(cur), children);
  }
  return children;
}
function* setRootRoute({ rootRoute }) {
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      rootRoute,
      routerComs: buildChildren(rootRoute, "")
    }
  });
}

function* routeRefresh() {
  let { rootRoute } = yield select(state => state.frame);
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      routerComs: buildChildren(rootRoute, "")
    }
  });
}

export default function* resizeEventSaga() {
  yield takeLatest(FRAME_SET_ROOTROUTE, setRootRoute);
  yield takeLatest(FRAME_ROUTE_REFRESH, routeRefresh);
}
