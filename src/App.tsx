import { RouterProvider } from 'react-router-dom'

import rootRouter from 'routes/rootRoute'

function App(): JSX.Element {
	return <RouterProvider router={rootRouter} />
}

export default App
