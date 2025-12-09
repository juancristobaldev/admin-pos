"use client";

import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

import { deleteCookies, getCookies } from "@/utils/cookies";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    // IMPORTANTE si usas cookies en auth
  });

  // Lee token en cada request
  const authLink = setContext((_, { headers }) => {
    const token = getCookies("token");

    return {
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "x-apollo-operation-name": "my-operation",
        authorization: token ? `${token}` : "",
      },
    };
  });

  // Manejo global de errores
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (
          err.message.includes("jwt expired") ||
          err.message.includes("JsonWebTokenError")
        ) {
          deleteCookies("token");
          deleteCookies("rol");

          // Navegación más limpia
          router.replace("/login");
        }

        if (err.message.includes("NOT_FOUND")) {
          router.push("/404");
        }
      }
    }

    if (networkError) {
      console.error("Network error:", networkError);
    }
  });

  const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </ApolloProvider>
    </Provider>
  );
}
