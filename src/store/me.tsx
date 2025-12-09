"use client";

// src/context/ClientContext.jsx
import React, { createContext, useContext, ReactNode } from "react";
import {
  useQuery,
  ApolloError,
  ApolloQueryResult,
  OperationVariables,
  gql,
} from "@apollo/client";
import { Business, Client } from "@/entitys";
const GET_CLIENT_DATA_QUERY = gql`
  query getAuthenticatedClient {
    # El nombre 'me' debe coincidir con el nombre de tu @Query() en NestJS.
    getAuthenticatedClient {
      id
      name
      email
      status
      createdAt

      # Incluimos los negocios asociados (Business[])
      businesses {
        id
        name
        address
        phone
        currency
        taxRate
        maxTables

        status
      }
    }
  }
`;
// Tipado del contexto
interface ClientContextValue {
  client: Client | null | undefined;
  businesses: Business[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (
    variables?: Partial<OperationVariables>
  ) => Promise<ApolloQueryResult<any>>;
  isAuthenticated: boolean;
}

interface ClientProviderProps {
  children: ReactNode;
}

// Valor inicial
const initialValue: ClientContextValue = {
  client: undefined,
  businesses: [],
  loading: true,
  error: undefined,
  refetch: async () => ({ data: undefined, loading: false, networkStatus: 7 }),
  isAuthenticated: false,
};

// Crear el contexto
const ClientContext = createContext<ClientContextValue | null>(null);

// Hook para consumir el contexto
export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error(
      "useClientContext debe ser usado dentro de un ClientProvider"
    );
  }
  return context;
};

// Provider
export function ClientProvider({ children }: ClientProviderProps) {
  const { data, loading, error, refetch } = useQuery(GET_CLIENT_DATA_QUERY, {
    fetchPolicy: "network-only",
  });

  const value: ClientContextValue = {
    client: data?.getAuthenticatedClient ?? null,
    businesses: data?.getAuthenticatedClient?.businesses ?? [],
    loading,
    error,
    refetch,
    isAuthenticated: !!data?.me,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}
