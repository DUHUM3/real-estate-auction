// import React, { createContext, useContext, useReducer, useCallback } from 'react';

// // حالة التطبيق الأولية
// const initialState = {
//   lands: [],
//   auctions: [],
//   clients: [],
//   isLoading: {
//     lands: false,
//     auctions: false,
//     clients: false,
//     allDataLoaded: false
//   },
//   filtersApplied: [],
//   lastFetchTime: null
// };

// // أنواع الإجراءات
// const ACTION_TYPES = {
//   SET_LOADING: 'SET_LOADING',
//   SET_LANDS: 'SET_LANDS',
//   SET_AUCTIONS: 'SET_AUCTIONS',
//   SET_CLIENTS: 'SET_CLIENTS',
//   SET_FILTERS_APPLIED: 'SET_FILTERS_APPLIED',
//   SET_ALL_DATA_LOADED: 'SET_ALL_DATA_LOADED',
//   RESET_DATA: 'RESET_DATA'
// };

// // ال reducer
// const appReducer = (state, action) => {
//   switch (action.type) {
//     case ACTION_TYPES.SET_LOADING:
//       return {
//         ...state,
//         isLoading: { ...state.isLoading, ...action.payload }
//       };
//     case ACTION_TYPES.SET_LANDS:
//       return {
//         ...state,
//         lands: action.payload,
//         lastFetchTime: Date.now()
//       };
//     case ACTION_TYPES.SET_AUCTIONS:
//       return {
//         ...state,
//         auctions: action.payload
//       };
//     case ACTION_TYPES.SET_CLIENTS:
//       return {
//         ...state,
//         clients: action.payload
//       };
//     case ACTION_TYPES.SET_FILTERS_APPLIED:
//       return {
//         ...state,
//         filtersApplied: action.payload
//       };
//     case ACTION_TYPES.SET_ALL_DATA_LOADED:
//       return {
//         ...state,
//         isLoading: { ...state.isLoading, allDataLoaded: true }
//       };
//     case ACTION_TYPES.RESET_DATA:
//       return {
//         ...initialState
//       };
//     default:
//       return state;
//   }
// };

// // إنشاء Context
// const AppContext = createContext();

// // مكون Provider
// export const AppProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(appReducer, initialState);

//   const setLoading = useCallback((loadingState) => {
//     dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loadingState });
//   }, []);

//   const setLands = useCallback((lands) => {
//     dispatch({ type: ACTION_TYPES.SET_LANDS, payload: lands });
//   }, []);

//   const setAuctions = useCallback((auctions) => {
//     dispatch({ type: ACTION_TYPES.SET_AUCTIONS, payload: auctions });
//   }, []);

//   const setClients = useCallback((clients) => {
//     dispatch({ type: ACTION_TYPES.SET_CLIENTS, payload: clients });
//   }, []);

//   const setFiltersApplied = useCallback((filters) => {
//     dispatch({ type: ACTION_TYPES.SET_FILTERS_APPLIED, payload: filters });
//   }, []);

//   const setAllDataLoaded = useCallback(() => {
//     dispatch({ type: ACTION_TYPES.SET_ALL_DATA_LOADED });
//   }, []);

//   const resetData = useCallback(() => {
//     dispatch({ type: ACTION_TYPES.RESET_DATA });
//   }, []);

//   const value = {
//     ...state,
//     setLoading,
//     setLands,
//     setAuctions,
//     setClients,
//     setFiltersApplied,
//     setAllDataLoaded,
//     resetData
//   };

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// // Hook لاستخدام Context
// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within an AppProvider');
//   }
//   return context;
// };