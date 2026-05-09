import { useEffect, useState } from 'react'
import { gsap } from 'gsap'

export function useCounter(target: number, duration = 1.6, start = false) {
    const [value, setValue] = useState(0)
    useEffect(() => {
        if (!start) return
        const obj = { val: 0 }
        gsap.to(obj, {
            val: target,
            duration,
            ease: 'power2.out',
            onUpdate: () => setValue(Math.round(obj.val)),
        })
    }, [start, target, duration])
    return value
}