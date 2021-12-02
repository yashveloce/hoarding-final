import './App.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Body from './Components/Body';
//import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';


import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
  ApolloProvider
} from "@apollo/client";

import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import Login from './Components/Login';
// import jsPDF from 'jspdf';

const wsLink = new WebSocketLink({
  uri: 'wss://bharti-expo-ads.hasura.app/v1/graphql',
  options: {
    reconnect: true
  }
});
const httpLink = new HttpLink({
  uri: 'https://bharti-expo-ads.hasura.app/v1/graphql',
  headers: {
    'x-hasura-access-key': 'YrlJbtD2GXzRiZk16RqL4AIAHwrI25nvzcUDAIPQlozRWw007jDGsro4mILTcmb6'
  }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
        <Route exact path="/Login" component={Login} />
          <Route path="/"> <Body /></Route>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
