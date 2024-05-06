import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from 'src/redux/store.ts';

export const ReduxProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Provider store={store}>
    { children }
  </Provider>
);
