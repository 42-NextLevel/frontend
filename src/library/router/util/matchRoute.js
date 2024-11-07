export const matchRoute = (routes, pathname) => {
  const branches = flattenRoutes(routes).sort((a, b) => b.score - a.score);

  let match = null;
  for (let i = 0; match == null && i < branches.length; i++) {
    match = matchRouteBranch(branches[i], pathname);
  }

  return match;
};

const flattenRoutes = (routes, branches = [], parentPath = '') => {
  routes.forEach((route) => {
    const path = joinPath(route.path, parentPath);

    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, path);
    }

    if (!route.element) {
      return;
    }

    branches.push({
      ...route,
      path,
      score: computeScore(path, route.index),
    });
  });

  return branches;
};

const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;

const computeScore = (path, index) => {
  const segments = path.split('/');
  let initialScore = segments.length;

  if (index) {
    initialScore += indexRouteValue;
  }

  return segments.reduce(
    (score, segment) =>
      score +
      (paramRe.test(segment)
        ? dynamicSegmentValue
        : segment === ''
          ? emptySegmentValue
          : staticSegmentValue),
    initialScore,
  );
};

const joinPath = (path, parentPath) => {
  if (path?.startsWith('/')) {
    return path;
  }

  return [parentPath, path].join('/').replace(/\/{2,}/g, '/');
};

export const matchRouteBranch = (branch, pathname) => {
  const match = matchPath({ path: branch.path }, pathname);

  if (!match) {
    return null;
  }

  return {
    ...match,
    ...branch,
  };
};

const matchPath = (pattern, pathname) => {
  const [matcher, compiledParams] = compilePath(pattern.path);

  const match = pathname.match(matcher);
  if (!match) {
    return null;
  }

  const [matchedPathname, ...captureGroups] = match;
  const params = compiledParams.reduce((memo, { paramName }, index) => {
    const value = captureGroups[index];
    memo[paramName] = value;
    return memo;
  }, {});

  return {
    params,
    pathname: matchedPathname,
  };
};

const compilePath = (path) => {
  const params = [];
  const regexpSource =
    '^' +
    path
      .replace(/\/*\*?$/, '')
      .replace(/^\/*/, '/')
      .replace(/:([\w-]+)/g, (_, paramName) => {
        params.push({ paramName });
        return '([^\\/]+)';
      }) +
    '$';

  const matcher = new RegExp(regexpSource);
  return [matcher, params];
};
