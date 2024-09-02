'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'

export default function StoreProvider({
    children
}: {
    children: React.ReactNode
}) {
    // Initialize the store once and persist it across renders
    const storeRef = useRef<AppStore>(makeStore());

    return <Provider store={storeRef.current}>{children}</Provider>
}