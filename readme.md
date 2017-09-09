<p align="center">
  <img src="./logo.png" align="center" alt="" width="300"/>
</p>

> Star the packages on GitHub being used in the current project or installed globally.

<p align="center">
  <img src="./demo.gif" align="center" alt="" width="800"/>
</p>

## Features
- [x] Star selected dependencies : `starring`
- [x] Star all dependencies of the current project: `starring --all`
- [x] Star a particular package: `starring colors`
- [x] Star selected global dependencies : `starring --global`
- [x] Star all global dependencies: `starring --global --all`

## Authorization
You will need to provide your GitHub usename and password for the first time so that it can create a token. The scope of the token is `'public_repo'`. After that it won't ask for any credentials.

## Install

```
$ npm install --global starring
```

## Usage Instructions
```
Usage
    $ starring [input]

  Options
    --all  Star all the packages listed in the package.json from current directory. [Default: false]
    --global Star

  Examples
    $ starring
    presents UI to select the packages you want to star.
    $ starring <package-name>
    stars package-name npm package on GitHub.
```


## License

MIT © [Ritesh Kumar](https://github.com/ritz078/starring)

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/8CBegPnJTnjtddvd2E18Su4F/ritz078/starring'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/8CBegPnJTnjtddvd2E18Su4F/ritz078/starring.svg' /></a>
