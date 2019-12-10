/* @flow */
import { findPublicPackages } from "@knit/find-packages";
import {
  findModifiedSince,
  findModifiedPackages
} from "@knit/find-modified-packages";
import needle from "@knit/needle";
import { normalizeBranch, currentBranch } from "@knit/git-branch-semver";

const modulesMap = findPublicPackages(needle.paths.workspace);

const modifiedSince = findModifiedSince(
  needle.paths.workspace,
  modulesMap,
  "master.."
);

export const prerelease = async () => {
  if (modifiedSince.length === 0) {
    // $FlowIgnore
    markdown(`
    No packages have been modified. 
      `);
    return;
  }

  const modifiedPackages = await findModifiedPackages(
    modulesMap,
    modifiedSince
  );

  if (modifiedPackages.length) {
    const branch = normalizeBranch(await currentBranch());
    // $FlowIgnore
    markdown(
      `
<details>
<summary>${
        modifiedPackages.length !== 1
          ? `We have found ${modifiedPackages.length} packages that have been modified by this PR.`
          : `We have found one package that has been modified by this PR.`
      }</summary>
<br/>

\`\`\`    
${modifiedPackages.join("\n")}
\`\`\`
</details>

You can install the pre-release version of ${
        modifiedPackages.length > 1 ? "these packages" : "this package"
      } by running:

\`\`\`
yarn add ${modifiedPackages.map(m => `${m}@${branch}`).join(" ")}
\`\`\`
`
    );
  }
};