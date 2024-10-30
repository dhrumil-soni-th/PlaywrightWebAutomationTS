# Automation Practice with Playwright using TypeScript

This project is an automation practice using Playwright for end-to-end testing. It includes tests for

- Home Page elements validation
- Login Functionality
- User Sign Up Functionality
- Course Management(Create and Delete)
- Category Management (create, update, delete)

## Project Structure

AUTOMATIONPRACTICEPLAYWRIGHT
├── node_modules/         # Node.js dependencies
├── playwright-report/    # Generated reports for test executions
├── test-results/         # Stores results of test runs
├── tests/                # Main directory for test-related files
│   ├── config/           # Configuration files for environment and test settings
│   ├── data/             # Test data files, such as JSON
│   ├── pageObjects/      # Page Object Model (POM) classes for application pages
│   ├── withoutPO/        # Tests without using Page Objects
│   └── withPO/           # Tests using Page Objects
├── utils/                # Utility functions and helper scripts
├── .gitignore            # Git ignore file to exclude certain files/folders from version control
├── package-lock.json     # Lockfile for NPM dependencies
├── package.json          # Project metadata and NPM scripts
└── playwright.config.ts  # Playwright configuration file

## Prerequisites

- Node.js (>= 18)
- npm (>= 6.x)

## Setup
1. Clone the repository:

    ```sh
    git clone https://github.com/dhrumil-soni-th/PlaywrightWebAutomationTS.git
    cd automationpracticeplaywright
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Configure the application URL and credentials in the `config.ts` file:

    ```typescript
    // config.ts
    export default {
      applicationUrl: 'http://your-application-url',
      email: 'your-email@example.com',
      password: 'your-password'
    };
    ```


## Running Tests

- To execute tests with the default configuration, run:

```sh
npx playwright test
```

- To run tests with a specific tag or folder, use:

```bash
# Run tests with Page Objects
npx playwright test tests/withPO

# Run all tests in headed mode for Chromium
npx playwright test ./tests/withPO/*.spec.ts --headed --project=chromium

# Debug mode
npx playwright test ./tests/withPO/*.spec.ts --headed --project=chromium --debug

# Run a specific test
npx playwright test ./tests/withPO/scenario1.spec.ts --headed --project=chromium
```

- Viewing Test Reports

After a test run, view the HTML report by running:

```bash
npx playwright show-report
```

## Configurations

Adjust environment settings and other configurations in tests/config/config.ts to tailor the framework to different environments (e.g., staging, production).
