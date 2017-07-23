# Octopod repositories

NPM repositories for the npm @octopod-service organisation

# List of services for the Octopod npm packages in the npm scope `@octopod-service`

## Install a service

You can install a service package with the following command :

```bash
# Replace the {{name}} by the service folder name
npm i @octopod-service/{{name}}
```

## List

You can find the list of the repositories here :

Repository | - | -
-|-|-notifier | [:octocat:](https://github.com/OpenMarshal/octopod-repositories/tree/master/repositories/notifier) | [![npm Version](https://img.shields.io/npm/v/@octopod-service/notifier.svg)](https://www.npmjs.com/package/@octopod-service/notifier)
web-getter | [:octocat:](https://github.com/OpenMarshal/octopod-repositories/tree/master/repositories/web-getter) | [![npm Version](https://img.shields.io/npm/v/@octopod-service/web-getter.svg)](https://www.npmjs.com/package/@octopod-service/web-getter)

Or make your own research here :
* [Repositories on GitHub](https://github.com/OpenMarshal/octopod-repositories/tree/master/repositories)
* [Repositories on npm](https://www.npmjs.com/search?q=%40octopod-service)

## Contribute

You can contribute and publish your own service in the `@octopod-service` npm scope by making a simple pull-request to this GitHub repository. To do so, you must create a folder in the `repositories` folder with the name of the package. Choose a name which describe well your service. You can make it in TypeScript or in JavaScript. You can add your own `README.md`, `LICENSE`, etc in the subfolder, but you must to add the `node_modules` folder or this kind of folders. Take a look at the existing folders in the `repositories` folder and use them as examples.

Do not hesitate to put yourself as author in the `package.json` of your new folder and to add your name in the `README.md`. When your pull-request will be accepted, the repository will be published under the scope `@octopod-service`, making your service accessible to everyone.

Here is the list of operations :
1. Fork the project.
2. Clone your forked project on your machine.
3. Add a folder in the `/repositories` folder of the cloned project. The name of this new folder must be the one to use to publish your repository into `@octopod-service`.
4. In this new folder, write your code, add a `package.json`, a `README.md`, a `LICENSE`, a `tsconfig.json` if you use TypeScript.
5. When you checked that your creation is working well, commit your changes.
6. Push your changes to your remote repository.
7. Make a pull-request to the original repository, in order to add your creation to the repositories.
8. Then, if your pull-request is accepted, it will be published on npm.
9. If you make any change, you can make a new pull-request to update the repository.

Thank you for your contribution.
