/* eslint-disable @typescript-eslint/no-explicit-any */
module.exports = {
  // this will check Typescript files
  "**/*.(ts|tsx)": () => "yarn tsc --noEmit",

  // This will lint and format TypeScript and                                             //JavaScript files
  "**/*.(ts|tsx|js)": (filenames: any[]) => [
    `yarn eslint --fix ${filenames.join(" ")}`,
    `yarn prettier --write ${filenames.join(" ")}`,
  ],

  // this will Format MarkDown and JSON
  "**/*.(md|json)": (filenames: any[]) =>
    `yarn prettier --write ${filenames.join(" ")}`,
};
