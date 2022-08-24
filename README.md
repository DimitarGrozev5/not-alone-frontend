# Link to site
https://notalone123.web.app/

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

Used for global state managment.

4. Mapbox GL JS

Library and Service used for displaying maps and visualising geospatial data.

5. WebSockets

WebSockets are implemented for receiving events from the backend API in real time.

6. Service Worker

A Service Worker is implemented for a couple of reasons.

- Handling Push Notification
- Allowing the Web App to be installed like a normal application
- Caching static assets for a faster load time and limited offline capability
- Caching dynamic data, for a faster load time and offline capabilities
- Using the Background Synchronization API to offer even more offline capabilities

7. Other

Additional libraries where used to solve specific tasks:

- **jwt-decode** - for decoding JSON Web Tokens
- **nanoid** - for generating IDs
- **localforage** - for storing data in _indexedDB_ for the purpose of background syncronization

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

The **index.js** file wraps the React Application with Redux **Provider** and a **Router** and renders the App to the page.

## /src/App.js

The **App.js** file sets up the Routes for React Router. It also handles authentication percistance and connects to the WebSocket Server

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
LocalStorage is chosen, firstly because at this time the backend doesn't support http-only cookies and secondly because all user inputs are sanitized both on the frontend and backend.
After the JWT is stored in localStorage, the Redux Store is updated by setting the isLogedIn property to true.

A custom hook - useAuth performs the following actions on first render of the App:

1. Checks if there is a JWT in the localStorage
2. Checks if the token is valid and is not expired
3. Updates the app state through the Redux Store

### Routing

Route Components are rendered conditionaly based on the logged in status, that is taken from the Redux Store.
Two custom hooks are created to solve specific routing issues:

- **usePersistRoute** - When the user reloads the page, the current url gets reset to the base url of the app. To avoid that, the **usePersistRoute** saves the current url to localStorage, whenever it changes. When the user reloads the page, the cutom hook loads the last saved route and navigates to it. This behaviour can be better achieved by configuring the server properly, but this is not yet done.

- **useLoad** and **Reload Component** - All pages are able to reload their data, when needed, but this functionality is available only from the **Component** that is rendered by the current Route. In some cases the App Component needs to force a reload of the currently rendered Route, without having access to it's inner functionalities. The **useNavigate** hook can't be used because it doesn't reload the component, if the tharget Route matches the current Route. For this reason the **useLoad** custom hook and **Reload** Component where created - to force reloads for the currently rendered Route.

### Page structure

When a user navigates to a Route, a Component is rendered. When the Component renders, it loads it's data from the backend and displays it. This happens every time the Route changes. A custom **useLoadPageData** was created, to handle this data load. The hook accepts an API endpoint, from which to request data, an optional configuration object and returns a couple of states and functions:

- `data` - a _State_ that stores the loaded data
- `reloadData` - a _function_ that trigers a page reload
- `isLoading` - _true_ if the page is fetching data
- `error` - _false_ if there is no error or _error message_ if there was an http error or server error
- `clearError` - function that clears the error message
- `sendRequest` - function that accepts configuration data and can be used to send requests to the backend. The function handles the state of `isLoading` and `error`

Additionaly the **useLoadPageData** hook can be set to pull data from the cache. If the _getCache_ flag is set to true, the hook tries to pull the requested API endpoint from the cache, if available. Only then it makes the network request to the backend to update the page and cache. This means that if the target page is cached, the user will see it load almost immediately. The hook returns these additional properties:

- `dataSource` - changes between _cache_, _network_ and _no-data_
- `offline` - helper value, that indicates if the page is offline

In order to provide a consistent user experience all **Pages** contain the following code:

`{isLoading && ( <LoadingSpinner asOverlay={dataSource !== "cache"} centerPage={dataSource === "cache"} /> )}`
`<ErrorModal show={!!error} error={error} onClose={clearError} />`

Using this code all pages display a **Loading Spinner** while the data is being fetched and display an **Error Modal** if there is an error.

### Comunication with the WebSocket Server

For communication with the WebSocket Server there is a cutom hook - `useWebSocket`.
The hook opens a WebSocket connection and it sends authentication credentials for it's first and only message.
After that the Server will send messages with events. There are three types of Events:

- **NOTIFICATION** - updates the Redux Store and displays a pop up message with the notification for requests, started trips or other
- **ALERT** - updates the Redux Store and displays a pop up message with the notification for a user that is late to a destination
- **UPDATE** - if an UPDATE has happend on the current page, the page will reload, using the useLoad hook, so the updated data can be fetched from the backend

# Specific functionalities

## Components

### Plan Trip component

**PlanTrip** is a component that can create, update and delete a trip. It accepts a `mode` prop, that sets it to _create, edit_ or _view_ mode. Depending on the mode, it provides a blank form, or it loads data and displays it.
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
- **trySync** - the `sendRequest`function will atempt to create a **Background Synchronization Task** instead of making a fetch request. The Service Worker will carry on the fetch request when an internet connection is available.

### useLongPress Hook

**useLongPress** is a custom hook that is used for handling long presses on buttons. This is useful for providing hints and tooltips on mobile devices. It's used in the MainNav component. The hook returns a function. The function accepts a handler function and an optional delay for the press and executes the handler if the users presses the target longer that the delay.

## Other functionality

### Service Worker

The **Service Worker** is being registered in the **index.html** file. When it's installed, it downloads and caches all of the static assets. This includes the _index.html_ page, all of the _js bundles_ and _css bundles_ and other files in the build directory. After that, every fetch request is intercepted by the service worker and if the request is to a statically cached file, the service worker returns it form the cache. It then creates a fetch request to update the cached file. Additionaly the Service Worker performes the following tasks:


- Intercepting all GET requests and storing the response object in the cache, before returning it to the page. This allows the caching of dynamic data for use when the user is offline
- Handling tasks, created by the **Background Synchronization API**
- Handling **Push Notifications**, send through the backend

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
