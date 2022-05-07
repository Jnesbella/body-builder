type PromiseGetter = () => Promise<any>

interface PromiseItem {
  promise: PromiseGetter
  resolve: (value: unknown | PromiseLike<unknown>) => void
  reject: (reason?: any) => void
}

let defaultWait = 0

const wait = (data: any, milliseconds = defaultWait) => {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), milliseconds)
  })
}

class Queue {
  static queue: PromiseItem[] = []
  static workingOnPromise = false

  static setWait = (nextWait: number) => {
    defaultWait = nextWait
  }

  static enqueue(promise: PromiseGetter) {
    return new Promise<unknown>((resolve, reject) => {
      const item = {
        promise,
        resolve,
        reject
      }

      this.queue.push(item)
      this.dequeue()
    })
  }

  static dequeue() {
    if (this.workingOnPromise) return

    const item = this.queue.shift()
    if (!item) return

    const resolvePromise = (value: any) => {
      this.workingOnPromise = false
      item.resolve(value)
      this.dequeue()
    }

    const rejectPromise = (err: Error) => {
      this.workingOnPromise = false
      item.reject(err)
      this.dequeue()
    }

    try {
      this.workingOnPromise = true
      item.promise().then(wait).then(resolvePromise).catch(rejectPromise)
    } catch (err) {
      rejectPromise(err as Error)
    }
  }
}

export default Queue
