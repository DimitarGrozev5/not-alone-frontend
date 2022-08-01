# General idea and required functionality

## Usecase

This App is useful for people who often travel alone and especialy for people who go hiking alone or in small groupes.

## Experience

This Web Application provides the following user experience.

1. A user **registers a new account**.
2. After registration he is able to **plan a new Trip**.
3. A Trip has a **name**, a list of **watchers** and a list of **stops**

- **Watchers** are other users of the App, who will be able to watch the trip and provide help if needed.
- **Stops** are locations along the trip. Each Stop has a name, description and estimated duration of travel

4. When the user decides to start the **Trip**, a countdown begins. If the user is unable to reach his next stop in the duration he estimated, his **watchers** will be notifiyed and will be able to view additional private data about the trip, gps location, information about his battery status etc.

# Used technologies, libraries and services

This web application is developed using the following technologies, libraries and services:

1. React
   Used for building the user interface

2. React Router v6
   Used for routing and navigation in the app

3. Redux Toolkit
   It was added early in the development process and it's used for global state managment. It turned out that the added functionality is not required and can be replaced with the Context API.

4. Mapbox GL JS
   Library and Service used for displaying maps and visualising geospatial data.

5. WebSockets
   WebSockets are implemented for receiving events from the backend API in real time.

6. Service Worker
   A Service Worker is implemented for a couple of reasons.

- Handling Push Notification
- Allowing the Web App to be installed like a normal application
- Caching static assets for a faster load time and limited offline capability

A Service Worker allows additional functionality to be added later on:

- Caching dynamic assets for an improved offline capability
- Implementing the Sync API for background synchronization of POST requests, when the internet access is limited

Both functionalities would be usefull for this particular Web App

7. Other
   Additional libraries where used to solve specific tasks:

- **jwt-decode** - for decoding JSON Web Tokens
- **nanoid** - for generating IDs

# Project structure

The project is structured in diferent folders.

## root folder

The root folder holds the **package.json** file, the development and production **enviroment variables** and any other helper functions, that are needed for the delivery process.

## /build folder

The build folder contains the production build of the Web App.

## /public

The public folder contains the **static assets** for the App and also the **Service Worker** file.

## /src

The src folder contains all of the Application **javascript** and **css** code.

## /src/index.js

The **index.js** file wraps the React Application with Redux **Provider** and a **Router**.

## /src/App.js

The **App.js** file sets up the Routs for React Router. It also handles authentication percistance and connects to the WebSocket Server

## /src/components

The **components** folder contains the React Components that are mostly single use. For example the Profile Page, the Register Page and WatchTrip Page. When a component requires other single use components, they are placed in subfolders. When a component requires a single use **Hook**, it's also placed in a subfolder of the original component.

## /src/common-components

The **common-components** folder contains components that are reusable. For example the Modal, the ErrorModal and form Input components. Every component is in a separate subfolder.

## /src/hooks

The **hooks** folder contains all of the React custom hooks that are reusable or that don't belong to a specific component.

## /src/redux-store

The **redux-store** folder contains Redux Toolkit **Slices**, **Thunks**, and the Redux **store**.

## /src/utils

The **utils** folder contains utility functions that are reusable and are not specific to React.

# Design decisions

## Overall App design

The Web App is split in four parts:

1. React frontend
2. Node + Express backend that provides a REST API and monitors active trips
3. WebSocket Server that sends events to connected users
4. MongoDB Atlas, used for data persistance.

## Frontend design

### Authentication

The backend allows the registration and login of users. After a successfull registration or login it sends back a JWT that is stored in localStorage.
LocalStorage is chosen, firstly because at this time the backend doesn't support http-only cookies and secondly because all user inputs are sanitized on the backend by the REST API or on the frontend by React.
After the JWT is stored in localStorage, the Redux Store is updated by setting the isLogedIn property to true.
On every App load the useAuth custom hook:

- Checks if there is a JWT in the localStorage
- Checks if the token is valid and is not expired
- Updates the app state through the Redux Store

### Routing

Route Components are rendered conditionaly based on the logged in statuse, that is taken from the Redux Store. A Nav Bar is created, using NavLink for navigating between pages.
Two custom hooks are created to solve specific issues:

- usePersistRoute - This hook saves the current page path to localStorage. After a reload it reads it and navigates authomaticaly.
- useLoad and Reload component - There was a need to force some pages to reload. The solution was to create a useLoad hook that accepts a path and if the provided path is also the current path it navigates to the Reload component where it navigates back to the orginal page. A very hacky solution but it gets the job done.

### Page structure

Every page loads it's data form the backend, when the user navigates to it. A custom useHttpClient was created. The hook exposes a couple of states and functions:

- `isLoading` - _true_ if the page is fetching data
- `error` - _false_ if there is no error or _error message_ if there was an http error or server error
- `clearError` - function that clears the error message
- `sendRequest` - function that accepts configuration data and sends requests to the backend. The function handles the state of `isLoading` and `error`

In order to provide a consistent user experience all **Pages** contain the following code:

`{isLoading && <LoadingSpinner asOverlay />}`
`{error && <ErrorModal error={error} onClose={clearError} />}`

Using this code all pages display a **Loading Spinner** while the data is being fetched and display an **Error Modal** if there is an error.

### Comunication with the WebSocket Server

For communication with the WebSocket Server there is a cutom hook - `useWebSocket`.
The hook opens a WebSocket connection and it sends authentication credentials for it's first and only message.
After that the Server will send messages with events. There are three types of Events:

- **NOTIFICATION** - updates the Redux Store and displays a pop up message with the notification for requests, started trips or other
- **ALERT** - updates the Redux Store and displays a pop up message with the notification for a user that is late to a destination
- **UPDATE** - if an UPDATE has happend on the current page, the page will reload, using the useLoad hook, so the updated data can be fetched

# Specific functionalities

## Components

### Plan Trip component

**PlanTrip** is a component that can create, update and delete a trip. It accepts a `mode` prop, that sets it to _create, edit_ or _view_ mode. Depending on the mode it provides a blank form, or it loads data and displays it.
A single trip is a relativly complex data structure. It contains multiple stops, each stop having multiple properties. It also has a name and a list of watchers. For this reason the state is managed through a `useReducer` hook that can handle multiple different actions. The **Reducer** function, that handles the incoming actions, uses **Immer**, in order to facilitate updates to the state without mutating it directly.

### PickUserInput component

**PickUserInput** is a reusable component that exposes a text input field. When the user inputs a value, the component sends a GET request to the backend and fetches other users that match the inputed value. The fetch function is throttled, so the user has a chance to input more data before a request is made. The component is used similary to a normal controlled input element, by providing a **value** and an **onChange** handler.

### DurationPicker component

**DurationPicker** is a reusable component that allows users to imput a time duration. It's used very similary to a normal controlled input element, by providing a duration prop and an onChange handler.

### Modal component

**Modal** is a reusable component that accepts a _title_ and _onClose_ handler and wraps whatever content is provided. It's used for diplaying messages and errors, and for requesting user input and confirmations. It utilizes the **createPortal** method from **ReactDOM** in order to render in a predetermend part of the DOM and not where it's called.

## Custom Hooks

### useHttpClient Hook

**useHttpClient** is a custom hook that controlls the loading and error state of pages and also exposes a function for sending requests - `sendRequest`.
`sendRequest` accepts a _target url_, a _request body_ and a _configuration object_. The configuration object sets the following properties:

- **method** - The method defaults to _GET_ if the body is empty, and to _POST_ if there is a body provided.
- **headers** - `sendRequest` authomaticaly sets the headers to `'Content-Type': 'application/json'`. Using **headers** this behaviour can be overwriten.
- **auth** - Adds the `Authorization` header and attaches the current user JWT
- **notJSON** - `sendRequest` authomaticaly passes the provided body through `JSON.stringify`. **notJSON** overwrites this behaviour.
- **getCache** - This option pulls data from the cache for the specific url. This is useful when a _cache first, then network data_ fetching strategy is being implemented.

### useLongPress Hook

**useLongPress** is a custom hook that is used for handling long presses on buttons. This is useful for providing hints and tooltips on mobile devices. It's used in the MainNav component. The hook returns a function. The function accepts a handler function and an optional delay for the press and executes the handler if the users presses the target longer that the delay.

## Other functionality

### Service Worker

The **Service Worker** is being registered in the **index.html** file. When it's installed, it downloads and caches all of the static assets. This includes the _index.html_ page, all of the _js bundles_ and _css bundles_ and other files in the build directory. After that, every fetch request is intercepted by the service worker and if the request is to a statically cached file, the service worker returns it form the cache. It then creates a fetch request to update the cached file.
The Service Worker also handles **Push Notifications**. It parses the incoming Push Notification and shows it to the user.

### GPS and Battery Information gathering

The user has the option to save his gps location and battery information when he is on an active trip. This is done through the Geolocation API and Battery Status API.

### Displaying Maping information

The saved GPS data can be displayed on screen. A `Map` component accept the GPS data as prop and displays it using the **Mapbox GL JS** library and **Mapbox** services.

# Deployment

The frontend is deployed in three steps:

1. A production build is transpiled, using `react-scripts build`
2. A helper function `setServiceWorker` is run, in order to copy the Service Worker to the build folder and to inject all of the newly generated static files, in the caching array of the Service Worker file
3. The App is deployed using the firebase CLI - `firebase deploy`

A `deploy` script is added to the _package.json_ file, to facilitate the process.

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
