/* @flow */

import type { TModules } from "@knit/knit-core";
import type { TPkgJson } from "@knit/needle";

import Listr from "listr";
import writePkg from "write-pkg";

import { findDependencies } from "@knit/find-dependencies";

const knit = require("@knit/knit-core");
const pathJoin = require("@knit/path-join");
const needle = require("@knit/needle");

type TCtx = {
  public: TModules,
  modified: TModules,
  modules: TModules,
  pkgs: { [k: string]: TPkgJson },
  version: string,
  workingDir: string,
  outputDir: string,
  parallel: boolean
};

const createKnitTask = m => ({
  title: m,
  task: (ctx: TCtx) =>
    findDependencies(ctx.workingDir || needle.paths.workingDirPath, m)
      .then(used => {
        const pkg = ctx.pkgs[m];
        const pkgM = knit.updateModulePkg(
          {
            internal: ctx.public,
            used,
            updated: []
          },
          {
            packagesDir: ctx.workingDir || needle.paths.workingDirPath,
            rootPkg: needle.pkg,
            pkg,
            version: ctx.version
          }
        );

        return pkgM;
      })
      .then(pkg =>
        writePkg(pathJoin(ctx.outputDir || needle.paths.outputDirPath, m), pkg)
      )
});

const tasks = [
  {
    title: "stitching together packages",
    task: (ctx: TCtx) =>
      new Listr(ctx.modules.map(createKnitTask), {
        concurrent: ctx.parallel
      })
  }
];

module.exports = tasks;