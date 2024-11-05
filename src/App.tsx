import Wrapper from './components/WrapperComponent/Wrapper'
import './App.css'
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  )
}

export default App
