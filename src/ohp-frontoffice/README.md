# Front-office monorepo for MFE applications

This workspace was generated with `npx create-nx-workspace@latest` and angular as started project.

- Angular 12
- Webpack 5
- @angular-architects/module-federation plugin

## Code Organization & Naming Conventions

- Apps configure dependency injection and wire up libraries. They should not contain any components, services, or business logic.

- Libs contain services, components, utilities, etc. They have well-defined public API.

A typical Nx workspace has many more libs than apps, so pay careful attention to the organization of the libs directory.

It's a good convention to put application-specific libraries in the directory matching the application’s name. This provides enough organization for small to mid-size applications.

```
├── apps/
│   ├── mfe-broker-portal/
│   └── mfe-auth-config/
├── libs/
│   ├── mfe-broker-portal/
│   │   ├── core/
│   │   ├── pages/
│   │   ├── api/
│   │   └── shared/
│   │   │   ├── styles/
│   │   │   ├── assets/
│   ├── mfe-auth-config/
│   │   ├── core/
│   │   ├── pages/
│   │   ├── api/
│   │   └── shared/
│   │   │   ├── styles/
│   │   │   ├── assets/
│   └── shared/
│       ├── ui/
│       ├── intl/
│       └── utils-testing/
├── tools/
├── nx.json
├── package.json
└── tsconfig.base.json
```

## HOW TO: Create an Angular micro frontend

In order to create an Angular MFE we should follow these steps:

- Generate Angular MFE application

```
nx g @nrwl/angular:application <mfe-name> --e2eTestRunner=none --prefix=<app-prefix> --standaloneConfig=true
```

- Add Module Federation configuration

```
ng add @angular-architects/module-federation --project <project-name> --port <PORT number>
```

For mor options follow this: [@nrwl/angular:application](https://nx.dev/angular/application#nrwlangularapplication)

### Example: Create Broker Portal micro frontend

```
// Create Broker Portal app
nx g @nrwl/angular:application mfe-broker-portal --e2eTestRunner=none --prefix=mbp --standaloneConfig=true

// Add MFE configuration to Broker Portal App
ng add @angular-architects/module-federation --project mfe-broker-portal --port 4280
```

## HOW TO: Create an Angular library

```
nx g @nrwl/angular:library <lib-name> --directory=<directory> --prefix=<lib-prefix> --standaloneConfig=true
```

### Example: Create shared-ui library

```
nx g @nrwl/angular:library ui --directory=shared --prefix=sui --standaloneConfig=true
```

For mor options follow this: [@nrwl/angular:library](https://nx.dev/angular/library#nrwlangularlibrary)

## HOW TO: Move an Angular application or library

Moves an Angular application or library to another folder within the workspace and updates the project configuration.

```
nx g @nrwl/angular:move --project <name> <destination>
```

### Example: Move libs/fluid-controls to libs/shared/fluid-controls:

```
nx g @nrwl/angular:move --project fluid-controls shared/fluid-controls
```

For mor options follow this: [@nrwl/angular:move](https://nx.dev/angular/move#nrwlangularmove)

## Continuous Integration / Continuous Delivery

Use every developer's time as efficiently as possible. Developers cost money and you don't want them to be constantly putting out fires in production. Automate testing and releases, remove all the humans in the process as much as possible. More testing means fewer bugs means less fear of change. Less fear of change means more experimentation and innovation. More automation means more time for experimentation and innovation.

With it, you can enable your organization to deliver:

- Code that respects consistent styling guidelines and formatting
- Reliable software is tested and so are its subsequent releases to avoid regressions
- Consistent releases: releasing a new version to the customer is as easy as possible and your team can ship fixes to production in no time
- Features that can easily be reverted if they degrade the user experience
- Any upcoming change to the product can be previewed as an independent unit of change

### Linting, Formatting and Unit tests

These three items are the foundational pieces for your team to ship more reliable software, faster.

#### Linting and formatting

Linting and formatting are essential to keep your codebase consistent and clean. Each team member should follow the same rules and conventions when it comes to writing code. Consistency in the codebase itself is essential:

- you do not want to bring confusion on how to write a given piece of code in your app when you onboard a new team member
- you do not want to have to document multiple ways of doing the same thing

We use these tools:

- ESlint
- Prettier

#### Unit tests

They should not take an extensive amount of time to run and should reveal errors or bugs in a matter of a few seconds or even a few minutes depending on the scale of your project.

We use these tools:

- Jest

### Terraform

Terraform is an open-source infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services. Terraform codifies cloud APIs into declarative configuration files.

- validate-iac
- terraform-plan

### Extra linters

- Conventional commits
- Jira tickets

### Releases

The last thing we want to automate is the release process. For this, I tend to favor having what I call a release branch in my Github repository and have the automated scripts run every time the main branch is merged on the release branch.

We use these tools:

- SemVer
- Nx affected builds
- AWS CLI
- Terraform-plan

## Code Ownership

it's crucial for a large company with multiple teams contributing to the same repository to establish clear code ownership.

Since Nx allows us to group apps and libs in directories, those directories can become code-ownership boundaries. That's why the structure of an Nx workspace often reflects the structure of an organization. GitHub users can use the `CODEOWNERS` file for that.

```
/libs/mfe-broker-portal     user1-lead
/apps/mfe-broker-portal     user1-lead
/libs/mfe-auth-config       user2-lead
/apps/mfe-auth-config       user2-lead
/libs/shared/ui             hank
/libs/shared/utils-testing  julie,hank
```

## Deploy a MFE to dev environment

- Every MFE project.json should have upload and deploy targets:
  - upload: will update version control S3 bucket with the last build code
  - deploy: will deploy the uploaded code to the specif bucket for that MFE

```
"upload": {
    "executor": "@nrwl/workspace:run-commands",
    "options": {
      "command": "nx build mfe-broker-portal --with-deps --prod && node tools/upload.mjs --appName=mfe-broker-portal --s3target=${S3_VERSION_CONTROL}"
    }
  },

  "deploy": {
    "executor": "@nrwl/workspace:run-commands",
    "options": {
      "command": "node tools/deploy.mjs --appName=mfe-broker-portal --s3source=${S3_VERSION_CONTROL} --s3target=${S3_MFE_BROKERPORTAL}"
    }
```

- Add S3_MFE_mfe-name within cd.yml pipeline as env variable to be consumed in the deploy target

```
  S3_MFE_BROKERPORTAL: 'dev-mfe-brokerportal-499636446108'
```

- Add a new MFE config within team/dev terraform configuration.

```
  {
    service_name = "mfe-brokerpanel",
    allowed_origins = [
      "https://closefo-d1-portalengine.dev.davincicloud.nl",
      "http://closefo-d1-portalengine.dev.davincicloud.nl",
      "https://closefo-d1-portalengine.dev.davincicloud.nl/*"
    ]
  },
```
