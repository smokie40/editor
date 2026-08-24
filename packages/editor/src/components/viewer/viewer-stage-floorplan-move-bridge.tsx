'use client'

import { useEffect, useMemo, useRef } from 'react'
import { resolveViewerStageFloorplanMove } from './viewer-stage-floorplan-move'

type Point = readonly [number, number]
type Active = {
  id: string
  pointerId: number
  node: SVGGElement
  scene: SVGGElement
  preview: SVGSVGElement
  transform: string | null
  startClient: Point
  startPlan: Point
  lastPlan: Point
}

function toPlan(scene: SVGGElement, clientX: number, clientY: number): Point | null {
  const svg = scene.ownerSVGElement
  const ctm = scene.getScreenCTM()
  if (!(svg && ctm)) return null
  const point = svg.createSVGPoint()
  point.x = clientX
  point.y = clientY
  const local = point.matrixTransform(ctm.inverse())
  return Number.isFinite(local.x) && Number.isFinite(local.y) ? [local.x, local.y] : null
}

function restore(active: Active) {
  if (active.transform === null) active.node.removeAttribute('transform')
  else active.node.setAttribute('transform', active.transform)
}

export function ViewerStageFloorplanMoveBridge({
  movableNodeIds,
  onNodeMove,
  onNodeSelect,
  root,
}: {
  movableNodeIds?: readonly string[]
  onNodeMove?: (nodeId: string, delta: Point) => void
  onNodeSelect?: (nodeId: string) => void
  root: HTMLElement | null
}) {
  const movable = useMemo(() => new Set(movableNodeIds ?? []), [movableNodeIds])
  const activeRef = useRef<Active | null>(null)

  useEffect(() => {
    if (!(root && onNodeMove && movable.size > 0)) return

    const cancel = () => {
      if (activeRef.current) restore(activeRef.current)
      activeRef.current = null
    }
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || !(event.target instanceof Element)) return
      const preview = event.target.closest('[data-floorplan-preview]')
      const node = event.target.closest('[data-floorplan-node-id]')
      if (!(preview instanceof SVGSVGElement) || !(node instanceof SVGGElement)) return
      if (!root.contains(preview)) return
      const id = node.getAttribute('data-floorplan-node-id')
      const scene = node.parentElement
      if (!(id && movable.has(id) && scene instanceof SVGGElement)) return
      const startPlan = toPlan(scene, event.clientX, event.clientY)
      if (!startPlan) return
      cancel()
      activeRef.current = {
        id,
        pointerId: event.pointerId,
        node,
        scene,
        preview,
        transform: node.getAttribute('transform'),
        startClient: [event.clientX, event.clientY],
        startPlan,
        lastPlan: startPlan,
      }
      onNodeSelect?.(id)
      event.preventDefault()
      event.stopPropagation()
    }
    const move = (event: PointerEvent) => {
      const active = activeRef.current
      if (!active || active.pointerId !== event.pointerId) return
      const point = toPlan(active.scene, event.clientX, event.clientY)
      if (!point) return
      active.lastPlan = point
      const dx = point[0] - active.startPlan[0]
      const dy = point[1] - active.startPlan[1]
      const prefix = `translate(${dx} ${dy})`
      active.node.setAttribute('transform', active.transform ? `${prefix} ${active.transform}` : prefix)
      event.preventDefault()
      event.stopPropagation()
    }
    const up = (event: PointerEvent) => {
      const active = activeRef.current
      if (!active || active.pointerId !== event.pointerId) return
      const point = toPlan(active.scene, event.clientX, event.clientY) ?? active.lastPlan
      const rect = active.preview.getBoundingClientRect()
      const inside = event.clientX >= rect.left && event.clientX <= rect.right
        && event.clientY >= rect.top && event.clientY <= rect.bottom
      const result = inside
        ? resolveViewerStageFloorplanMove(
            active.id,
            active.startClient,
            [event.clientX, event.clientY],
            active.startPlan,
            point,
          )
        : null
      restore(active)
      activeRef.current = null
      if (result) onNodeMove(result.nodeId, result.delta)
      event.preventDefault()
      event.stopPropagation()
    }
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !activeRef.current) return
      cancel()
      event.preventDefault()
      event.stopImmediatePropagation()
    }

    root.addEventListener('pointerdown', down, true)
    window.addEventListener('pointermove', move, true)
    window.addEventListener('pointerup', up, true)
    window.addEventListener('pointercancel', up, true)
    window.addEventListener('keydown', key, true)
    return () => {
      root.removeEventListener('pointerdown', down, true)
      window.removeEventListener('pointermove', move, true)
      window.removeEventListener('pointerup', up, true)
      window.removeEventListener('pointercancel', up, true)
      window.removeEventListener('keydown', key, true)
      cancel()
    }
  }, [movable, onNodeMove, onNodeSelect, root])

  return null
}
