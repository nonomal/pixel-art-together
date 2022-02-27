import { onDestroy } from 'svelte'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import { useRoom } from './useRoom'

export function useSelf (): Writable<any> | null {
  const room = useRoom()

  if (!room) {
    console.error('Use RoomProvider as parent with id prop')
    return null
  }

  const self = writable()

  const unsubscribeConnection = room.subscribe('connection', () => {
    self.set(room.getSelf())
  })
  const unsubscribe = room.subscribe('my-presence', () => {
    self.set(room.getSelf())
  })

  onDestroy(() => {
    unsubscribeConnection()
    unsubscribe()
  })

  return self
}
